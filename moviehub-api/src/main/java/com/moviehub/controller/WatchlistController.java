package com.moviehub.controller;

import com.moviehub.dto.WatchlistItemResponse;
import com.moviehub.dto.WatchlistRequest;
import com.moviehub.entity.User;
import com.moviehub.entity.WatchlistItem;
import com.moviehub.repository.UserRepository;
import com.moviehub.repository.WatchlistRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {
    private final WatchlistRepository watchlist;
    private final UserRepository users;

    public WatchlistController(WatchlistRepository watchlist, UserRepository users) {
        this.watchlist = watchlist;
        this.users = users;
    }

    @GetMapping
    public List<WatchlistItemResponse> list(Authentication auth) {
        return watchlist.findByUserEmailOrderByAddedAtDesc(auth.getName())
                .stream().map(WatchlistItemResponse::from).toList();
    }

    @PostMapping
    public ResponseEntity<WatchlistItemResponse> add(@Valid @RequestBody WatchlistRequest req, Authentication auth) {
        // Adding the same movie twice just returns the existing item
        var existing = watchlist.findByUserEmailAndTmdbId(auth.getName(), req.tmdbId());
        if (existing.isPresent()) {
            return ResponseEntity.ok(WatchlistItemResponse.from(existing.get()));
        }
        User user = users.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        WatchlistItem item = new WatchlistItem();
        item.setUser(user);
        item.setTmdbId(req.tmdbId());
        item.setTitle(req.title());
        item.setPosterPath(req.posterPath());
        item.setVoteAverage(req.voteAverage());
        item.setReleaseDate(req.releaseDate());
        watchlist.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(WatchlistItemResponse.from(item));
    }

    @DeleteMapping("/{tmdbId}")
    public ResponseEntity<Void> remove(@PathVariable Long tmdbId, Authentication auth) {
        watchlist.findByUserEmailAndTmdbId(auth.getName(), tmdbId).ifPresent(watchlist::delete);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clear(Authentication auth) {
        watchlist.deleteAll(watchlist.findByUserEmailOrderByAddedAtDesc(auth.getName()));
        return ResponseEntity.noContent().build();
    }
}
