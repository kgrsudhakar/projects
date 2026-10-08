package com.example.books.service;

import com.example.books.exception.ResourceNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Stores cover images on disk. The type is checked from the file's first bytes, not the client's claim. */
@Service
public class CoverStorageService {
    private static final long MAX_BYTES = 2L * 1024 * 1024;
    private final Path dir;

    public CoverStorageService(@Value("${app.upload-dir:./uploads}") String uploadDir) throws IOException {
        this.dir = Path.of(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(dir);
    }

    public String store(MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("The file is empty");
        if (file.getSize() > MAX_BYTES) throw new IllegalArgumentException("Image must be 2 MB or smaller");
        byte[] head = new byte[12];
        int read;
        try (InputStream in = file.getInputStream()) { read = in.readNBytes(head, 0, head.length); }
        if (read < head.length) throw new IllegalArgumentException("Only JPEG, PNG or WebP images are allowed");
        String name = UUID.randomUUID() + "." + detectExtension(head);
        try (InputStream in = file.getInputStream()) { Files.copy(in, resolve(name)); }
        return name;
    }

    public Resource load(String name) {
        Path p = resolve(name);
        if (!Files.exists(p)) throw new ResourceNotFoundException("Cover file not found");
        return new FileSystemResource(p);
    }

    public void delete(String name) {
        if (name == null) return;
        try { Files.deleteIfExists(resolve(name)); } catch (IOException ignored) { /* best effort */ }
    }

    public static MediaType mediaType(String name) {
        if (name.endsWith(".png")) return MediaType.IMAGE_PNG;
        if (name.endsWith(".webp")) return MediaType.parseMediaType("image/webp");
        return MediaType.IMAGE_JPEG;
    }

    private static String detectExtension(byte[] h) {
        if ((h[0] & 0xFF) == 0xFF && (h[1] & 0xFF) == 0xD8 && (h[2] & 0xFF) == 0xFF) return "jpg";
        if ((h[0] & 0xFF) == 0x89 && h[1] == 'P' && h[2] == 'N' && h[3] == 'G') return "png";
        if (h[0] == 'R' && h[1] == 'I' && h[2] == 'F' && h[3] == 'F' && h[8] == 'W' && h[9] == 'E' && h[10] == 'B' && h[11] == 'P') return "webp";
        throw new IllegalArgumentException("Only JPEG, PNG or WebP images are allowed");
    }

    private Path resolve(String name) {
        Path p = dir.resolve(name).normalize();
        if (!p.startsWith(dir)) throw new IllegalArgumentException("Invalid file name");
        return p;
    }
}
