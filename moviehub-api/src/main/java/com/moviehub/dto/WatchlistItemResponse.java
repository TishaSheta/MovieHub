package com.moviehub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.moviehub.entity.WatchlistItem;

public record WatchlistItemResponse(
        @JsonProperty("id") Long id,
        @JsonProperty("title") String title,
        @JsonProperty("poster_path") String posterPath,
        @JsonProperty("vote_average") Double voteAverage,
        @JsonProperty("release_date") String releaseDate) {

    public static WatchlistItemResponse from(WatchlistItem w) {
        return new WatchlistItemResponse(w.getTmdbId(), w.getTitle(), w.getPosterPath(),
                w.getVoteAverage(), w.getReleaseDate());
    }
}
