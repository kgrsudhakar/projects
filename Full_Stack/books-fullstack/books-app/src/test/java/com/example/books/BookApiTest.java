package com.example.books;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {"spring.datasource.url=jdbc:h2:mem:testdb", "app.upload-dir=target/test-uploads"})
@AutoConfigureMockMvc
class BookApiTest {

    @Autowired MockMvc mvc;

    private String login(String user, String pass) throws Exception {
        return mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"" + user + "\",\"password\":\"" + pass + "\"}"))
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();
    }

    @Test
    void listingBooksIsPublic() throws Exception {
        mvc.perform(get("/api/books"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void creatingABookRequiresLogin() throws Exception {
        mvc.perform(post("/api/books").contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanLogIn() throws Exception {
        String body = login("admin", "admin123");
        org.junit.jupiter.api.Assertions.assertEquals("ADMIN", JsonPath.read(body, "$.role"));
        org.junit.jupiter.api.Assertions.assertFalse(((String) JsonPath.read(body, "$.refreshToken")).isEmpty());
    }

    @Test
    void wrongPasswordIsRejected() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"admin\",\"password\":\"nope-nope\"}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void refreshTokenRotatesAndCannotBeReused() throws Exception {
        String refresh = JsonPath.read(login("user", "user123"), "$.refreshToken");
        String payload = "{\"refreshToken\":\"" + refresh + "\"}";

        mvc.perform(post("/api/auth/refresh").contentType(MediaType.APPLICATION_JSON).content(payload))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").isNotEmpty());

        // the old token was rotated out, so using it again must fail
        mvc.perform(post("/api/auth/refresh").contentType(MediaType.APPLICATION_JSON).content(payload))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void userManagementIsAdminOnly() throws Exception {
        mvc.perform(get("/api/admin/users")).andExpect(status().isUnauthorized());

        String userToken = JsonPath.read(login("user", "user123"), "$.accessToken");
        mvc.perform(get("/api/admin/users").header("Authorization", "Bearer " + userToken))
            .andExpect(status().isForbidden());

        String adminToken = JsonPath.read(login("admin", "admin123"), "$.accessToken");
        mvc.perform(get("/api/admin/users").header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].username").isNotEmpty());
    }

    @Test
    void coverCanBeUploadedAndServed() throws Exception {
        String token = JsonPath.read(login("admin", "admin123"), "$.accessToken");
        byte[] png = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0};

        mvc.perform(multipart("/api/books/1/cover")
                .file(new MockMultipartFile("file", "cover.png", "image/png", png))
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.coverUrl").isNotEmpty());

        mvc.perform(get("/api/books/1/cover"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.IMAGE_PNG));
    }

    @Test
    void nonImageUploadIsRejected() throws Exception {
        String token = JsonPath.read(login("admin", "admin123"), "$.accessToken");
        mvc.perform(multipart("/api/books/1/cover")
                .file(new MockMultipartFile("file", "x.txt", "text/plain", "hello, this is not an image".getBytes()))
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isBadRequest());
    }
}
