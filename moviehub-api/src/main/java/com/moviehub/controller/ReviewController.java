package com.moviehub.controller;

import com.moviehub.dto.ReviewRequest;
import com.moviehub.dto.ReviewResponse;
import com.moviehub.entity.Review;
import com.moviehub.entity.User;
import com.moviehub.repository.ReviewRepository;
import com.moviehub.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {
    private final ReviewRepository reviews;
    private final UserRepository users;

    public ReviewController(ReviewRepository reviews, UserRepository users) {
        this.reviews = reviews;
        this.users = users;
    }

    // Public
    @GetMapping("/movies/{tmdbId}/reviews")
    public List<ReviewResponse> list(@PathVariable Long tmdbId) {
        return reviews.findByTmdbIdOrderByCreatedAtDesc(tmdbId)
                .stream().map(ReviewResponse::from).toList();
    }

    // One review per user per movie: posting again updates it
    @PostMapping("/movies/{tmdbId}/reviews")
    public ResponseEntity<ReviewResponse> save(@PathVariable Long tmdbId,
                                               @Valid @RequestBody ReviewRequest req,
                                               Authentication auth) {
        User user = users.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        Review review = reviews.findByUserEmailAndTmdbId(auth.getName(), tmdbId).orElseGet(Review::new);
        boolean isNew = review.getId() == null;
        review.setUser(user);
        review.setTmdbId(tmdbId);
        review.setRating(req.rating());
        review.setComment(req.comment() == null ? "" : req.comment().trim());
        review.setCreatedAt(Instant.now());
        reviews.save(review);
        return ResponseEntity.status(isNew ? HttpStatus.CREATED : HttpStatus.OK)
                .body(ReviewResponse.from(review));
    }

    // Owner or ADMIN can delete
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        Review review = reviews.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));
        boolean owner = review.getUser().getEmail().equals(auth.getName());
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!owner && !admin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your review");
        }
        reviews.delete(review);
        return ResponseEntity.noContent().build();
    }
}
