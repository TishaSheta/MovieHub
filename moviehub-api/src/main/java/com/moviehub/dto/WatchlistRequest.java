package com.moviehub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record WatchlistRequest(
        @JsonProperty("id") @NotNull Long tmdbId,
        @NotBlank String title,
        @JsonProperty("poster_path") String posterPath,
        @JsonProperty("vote_average") Double voteAverage,
        @JsonProperty("release_date") String releaseDate) {}
