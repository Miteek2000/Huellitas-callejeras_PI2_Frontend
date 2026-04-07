package com.huellitascallejeras.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huellitascallejeras.pages.LoginPage;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;

/**
 * Centraliza el login de Selenium para reutilizarlo en todas las clases de test.
 * Evita duplicar el flujo de autenticación en cada @BeforeAll / @BeforeEach.
 */
public class AuthUtils {

    private static final String BASE_URL      = System.getenv("BASE_URL") != null
            ? System.getenv("BASE_URL") : "http://localhost:3000";
    private static final String TESTDATA_PATH = "resources/testdata/test_data.json";

    private final WebDriver driver;

    public AuthUtils(WebDriver driver) {
        this.driver = driver;
    }

    /** Inicia sesión usando las credenciales del rol "valido" definido en test_data.json. */
    public void loginAsDefaultUser() throws IOException {
        JsonNode testData = loadTestData();
        String email      = testData.at("/usuarios/valido/email").asText();
        String password   = testData.at("/usuarios/valido/password").asText();
        loginAs(email, password);
    }

    /** Inicia sesión usando las credenciales del rol "colaborador" definido en test_data.json. */
    public void loginAsColaborador() throws IOException {
        JsonNode testData = loadTestData();
        String email      = testData.at("/usuarios/colaborador/email").asText();
        String password   = testData.at("/usuarios/colaborador/password").asText();
        loginAs(email, password);
    }

    /** Inicia sesión usando las credenciales del rol "propietario" definido en test_data.json. */
    public void loginAsOwner() throws IOException {
        JsonNode testData = loadTestData();
        String email      = testData.at("/usuarios/propietario/email").asText();
        String password   = testData.at("/usuarios/propietario/password").asText();
        loginAs(email, password);
    }

    /** Inicia sesión con cualquier credencial proporcionada directamente. */
    public void loginAs(String email, String password) {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.open(BASE_URL);
        loginPage.login(email, password);
        // Espera a que la URL ya no sea la de login
        new WaitUtils(driver).untilUrlContains("/");
    }

    /** Navega a la página de login (cierra sesión implícitamente limpiando cookies). */
    public void logout() {
        driver.manage().deleteAllCookies();
        driver.get(BASE_URL + "/auth/login");
    }

    private JsonNode loadTestData() throws IOException {
        return new ObjectMapper().readTree(new File(TESTDATA_PATH));
    }
}
