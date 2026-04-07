package com.huellitascallejeras.tests;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huellitascallejeras.pages.LoginPage;
import com.huellitascallejeras.utils.DriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class LoginTest {

    private static final String BASE_URL       = System.getenv("BASE_URL") != null
            ? System.getenv("BASE_URL") : "http://localhost:3000";
    private static final String TESTDATA_PATH  = "resources/testdata/test_data.json";

    private static WebDriver driver;
    private static JsonNode  testData;
    private LoginPage loginPage;

    @BeforeAll
    static void setUp() throws IOException {
        driver   = DriverManager.getDriver();
        testData = new ObjectMapper().readTree(new File(TESTDATA_PATH));
    }

    @AfterAll
    static void tearDown() {
        DriverManager.quitDriver();
    }

    @BeforeEach
    void initPage() {
        loginPage = new LoginPage(driver);
    }

    @Test
    @Order(1)
    @DisplayName("TC-001 — Login con credenciales válidas redirige a /galeria")
    void testLoginExitoso() {
        loginPage.open(BASE_URL);
        String email    = testData.at("/usuarios/valido/email").asText();
        String password = testData.at("/usuarios/valido/password").asText();
        loginPage.login(email, password);
        // TC-001: debe redirigir específicamente a /galeria
        new com.huellitascallejeras.utils.WaitUtils(driver).untilUrlContains("/galeria");
        Assertions.assertTrue(
                driver.getCurrentUrl().contains("/galeria"),
                "TC-001: Tras login exitoso debería redirigir a /galeria");
    }

    @Test
    @Order(2)
    @DisplayName("Login con credenciales inválidas muestra mensaje de error")
    void testLoginCredencialesInvalidas() {
        loginPage.open(BASE_URL);
        String email    = testData.at("/usuarios/invalido/email").asText();
        String password = testData.at("/usuarios/invalido/password").asText();
        loginPage.login(email, password);
        String error = loginPage.getErrorMessage();
        Assertions.assertFalse(error.isEmpty(), "Debería mostrar un mensaje de error");
    }

    @Test
    @Order(3)
    @DisplayName("Enviar formulario vacío muestra validaciones requeridas")
    void testLoginCamposVacios() {
        loginPage.open(BASE_URL);
        loginPage.clickSubmit();
        String error = loginPage.getErrorMessage();
        Assertions.assertFalse(error.isEmpty(), "Debería mostrar validación de campos requeridos");
    }
}
