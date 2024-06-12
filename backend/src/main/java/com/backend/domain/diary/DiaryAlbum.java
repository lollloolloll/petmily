package com.backend.domain.diary;

import jakarta.persistence.Lob;
import lombok.Data;

@Data
public class DiaryAlbum {
    private Integer id;
    private String title;

    @Lob
    private byte[] data;
}
