package com.moviehub.dto;

import com.moviehub.entity.Review;
import java.time.Instant;

public record ReviewResponse(Long id, Long userId, String userName, int rating,
                             String comment, Instant createdAt) {

    public static ReviewResponse from(Review r) {
        return new ReviewResponse(r.getId(), r.getUser().getId(), r.getUser().getName(),
                r.getRating(), r.getComment(), r.getCreatedAt());
    }
}
