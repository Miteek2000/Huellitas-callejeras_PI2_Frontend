package com.huellitascallejeras.tests;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huellitascallejeras.pages.RegisterPage;
import com.huellitascallejeras.utils.DriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RegisterTest {

    private static final String BASE_URL      = System.getenv("BASE_URL") != null
            ? System.getenv("BASE_URL") : "http://localhost:3000";
    private static final String TESTDATA_PATH = "resources/testdata/test_data.json";

    private static WebDriver driver;
    private static JsonNode  testData;
    private RegisterPage registerPage;

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
        registerPage = new RegisterPage(driver);
    }

    // ─────────────────────────────────────────────────────────────────
    // TC-003 — Registro de nuevo refugio y propietario
    // ─────────────────────────────────────────────────────────────────

    /**
     * TC-003 — Paso a paso:
     * 1. Completar formulario de registro.
     * 2. Aceptar términos.
     * 3. Clic en "Registrarse".
     * Resultado: usuario y refugio creados, redirección a /galeria.
     */
    @Test
    @Order(1)
    @DisplayName("TC-003 — Registro exitoso redirige a /galeria")
    void tc003_registroExitosoRedirigeAGaleria() {
        registerPage.open(BASE_URL);

        String nombre   = testData.at("/registro/valido/nombre").asText();
        String email    = testData.at("/registro/valido/email").asText();
        String password = testData.at("/registro/valido/password").asText();

        // 1. Completar formulario
        registerPage.fillForm(nombre, email, password);

        // 2. Clic en "Registrarse" → abre modal de términos
        registerPage.clickSubmit();

        // 3. Aceptar términos
        registerPage.waitForTermsModal();
        Assertions.assertTrue(registerPage.isTermsModalVisible(),
                "TC-003: El modal de términos debería abrirse tras enviar el formulario");
        registerPage.acceptTerms();

        // Resultado: redirige a /galeria
        Assertions.assertTrue(
                driver.getCurrentUrl().contains("/galeria"),
                "TC-003: Tras el registro exitoso debería redirigir a /galeria");
    }

    @Test
    @Order(2)
    @DisplayName("TC-003 — Rechazar términos no completa el registro")
    void tc003_rechazarTerminosNoCreaUsuario() {
        registerPage.open(BASE_URL);

        String nombre   = testData.at("/registro/valido/nombre").asText();
        String email    = testData.at("/registro/alternativo/email").asText();
        String password = testData.at("/registro/valido/password").asText();

        registerPage.fillForm(nombre, email, password);
        registerPage.clickSubmit();
        registerPage.waitForTermsModal();
        registerPage.declineTerms();

        // Debe permanecer en el registro (no redirige a galería)
        Assertions.assertFalse(
                driver.getCurrentUrl().contains("/galeria"),
                "TC-003: Rechazar términos no debería completar el registro");
    }

    // ─────────────────────────────────────────────────────────────────
    // TC-004 — Validación de campos obligatorios en registro
    // ─────────────────────────────────────────────────────────────────

    /**
     * TC-004 — Paso a paso:
     * 1. Dejar campos vacíos.
     * 2. Clic en "Registrarse".
     * Resultado: mensajes de error por campo vacío, sin envío al backend.
     */
    @Test
    @Order(3)
    @DisplayName("TC-004 — Campos vacíos muestran errores sin enviar al backend")
    void tc004_camposVaciosMuestranError() {
        registerPage.open(BASE_URL);
        // No completar ningún campo
        registerPage.clickSubmit();

        // No debe abrirse el modal de términos (no hubo envío)
        Assertions.assertFalse(registerPage.isTermsModalVisible(),
                "TC-004: El modal de términos no debería abrirse con campos vacíos");

        // Debe mostrar mensaje de error de validación
        String error = registerPage.getErrorMessage();
        Assertions.assertFalse(error.isEmpty(),
                "TC-004: Debería mostrar error de campos requeridos");
    }

    @Test
    @Order(4)
    @DisplayName("TC-004 — Solo email vacío muestra error específico")
    void tc004_emailVacioMuestraError() {
        registerPage.open(BASE_URL);
        registerPage.fillNombre("Test Usuario");
        registerPage.fillPassword("Password1!");
        registerPage.fillConfirmPassword("Password1!");
        // No completar email
        registerPage.clickSubmit();

        Assertions.assertFalse(registerPage.isTermsModalVisible(),
                "TC-004: Sin email no debería abrirse el modal de términos");

        String error = registerPage.getErrorMessage();
        Assertions.assertFalse(error.isEmpty(),
                "TC-004: Debería mostrar error por email vacío");
    }

    @Test
    @Order(5)
    @DisplayName("TC-004 — Contraseñas que no coinciden muestran error")
    void tc004_contraseniasNoCoinciden() {
        registerPage.open(BASE_URL);
        String nombre = testData.at("/registro/valido/nombre").asText();
        String email  = testData.at("/registro/alternativo/email").asText();

        registerPage.fillNombre(nombre);
        registerPage.fillEmail(email);
        registerPage.fillPassword("Password1!");
        registerPage.fillConfirmPassword("OtraPassword2!");
        registerPage.clickSubmit();

        Assertions.assertFalse(registerPage.isTermsModalVisible(),
                "TC-004: Contraseñas distintas no deberían abrir el modal de términos");

        String error = registerPage.getErrorMessage();
        Assertions.assertFalse(error.isEmpty(),
                "TC-004: Debería mostrar error de contraseñas no coincidentes");
    }
}
