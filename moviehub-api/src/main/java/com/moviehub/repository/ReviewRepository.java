package com.moviehub.repository;

import com.moviehub.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTmdbIdOrderByCreatedAtDesc(Long tmdbId);
    Optional<Review> findByUserEmailAndTmdbId(String email, Long tmdbId);
}
