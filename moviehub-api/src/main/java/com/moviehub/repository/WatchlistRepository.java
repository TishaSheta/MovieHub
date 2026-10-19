package com.moviehub.repository;

import com.moviehub.entity.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {
    List<WatchlistItem> findByUserEmailOrderByAddedAtDesc(String email);
    Optional<WatchlistItem> findByUserEmailAndTmdbId(String email, Long tmdbId);
}
