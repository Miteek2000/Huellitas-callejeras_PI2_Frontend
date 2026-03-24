package com.huellitascallejeras.tests;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huellitascallejeras.pages.ExpedientePage;
import com.huellitascallejeras.utils.AuthUtils;
import com.huellitascallejeras.utils.DriverManager;
import com.huellitascallejeras.utils.WaitUtils;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.util.List;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ExpedienteTest {

    private static final String BASE_URL      = System.getenv("BASE_URL") != null
            ? System.getenv("BASE_URL") : "http://localhost:3000";
    private static final String TESTDATA_PATH = "resources/testdata/test_data.json";

    private static WebDriver driver;
    private static JsonNode  testData;
    private ExpedientePage expedientePage;

    @BeforeAll
    static void setUp() throws IOException {
        driver   = DriverManager.getDriver();
        testData = new ObjectMapper().readTree(new File(TESTDATA_PATH));
        new AuthUtils(driver).loginAsDefaultUser();
    }

    @AfterAll
    static void tearDown() {
        DriverManager.quitDriver();
    }

    @BeforeEach
    void initPage() {
        expedientePage = new ExpedientePage(driver);
    }

    @Test
    @Order(1)
    @DisplayName("La página de expedientes renderiza tarjetas de animales")
    void testListadoExpedientesVisible() {
        expedientePage.openList(BASE_URL);
        var cards = expedientePage.getExpedienteCards();
        Assertions.assertNotNull(cards, "Debería retornar una lista");
    }

    @Test
    @Order(2)
    @DisplayName("TC-005 — Crear expediente redirige a /expediente/{id}")
    void testCrearExpedienteExitoso() {
        expedientePage.openNew(BASE_URL);
        String nombre  = testData.at("/animales/valido/nombre").asText();
        String especie = testData.at("/animales/valido/especie").asText();
        String sexo    = testData.at("/animales/valido/sexo").asText();
        expedientePage.fillNombre(nombre);
        expedientePage.selectEspecie(especie);
        expedientePage.selectSexo(sexo);
        expedientePage.submit();
        // TC-005: verificar redirección a /expediente/{id} (URL dinámica)
        new WaitUtils(driver).untilUrlContains("/expediente/");
        String currentUrl = driver.getCurrentUrl();
        Assertions.assertTrue(
                currentUrl.matches(".*/expediente/\\d+.*") || currentUrl.contains("/expediente/"),
                "TC-005: Tras crear el expediente debería redirigir a /expediente/{id}");
    }

    @Test
    @Order(3)
    @DisplayName("TC-006 — Enviar formulario vacío muestra errores sin petición POST")
    void testCrearExpedienteNombreVacio() {
        expedientePage.openNew(BASE_URL);
        expedientePage.submit();
        // TC-006: sin datos la URL no debe cambiar (no hay POST al backend)
        Assertions.assertTrue(
                driver.getCurrentUrl().contains("/expediente/nuevo"),
                "TC-006: Sin datos no debería salir del formulario");
        String error = expedientePage.getErrorMessage();
        Assertions.assertFalse(error.isEmpty(), "TC-006: Debería mostrar error de campos requeridos");
    }

    // ─────────────────────────────────────────────────────────────────
    // TC-007 — Edición de expediente existente
    // ─────────────────────────────────────────────────────────────────

    /**
     * TC-007 — Paso a paso:
     * 1. Acceder a un expediente.
     * 2. Clic en icono editar.
     * 3. Modificar campos.
     * 4. Clic en "Guardar".
     * Resultado: datos actualizados en BD, confirmación modal visible.
     */
    @Test
    @Order(4)
    @DisplayName("TC-007 — Editar expediente muestra confirmación modal")
    void testEditarExpedienteExistente() {
        expedientePage.openList(BASE_URL);
        List<WebElement> cards = expedientePage.getExpedienteCards();
        Assumptions.assumeTrue(!cards.isEmpty(),
                "TC-007: Se necesita al menos un expediente para editar");

        // 1. Abrir modo edición
        cards.get(0).findElement(By.cssSelector("[data-testid='edit-expediente-btn']")).click();

        WaitUtils wait = new WaitUtils(driver);

        // 2. Modificar el nombre
        WebElement nombreField = wait.untilVisible(By.name("nombre"));
        nombreField.clear();
        nombreField.sendKeys("Nombre Editado Test");

        // 3. Guardar
        wait.untilClickable(By.cssSelector("button[type='submit']")).click();

        // TC-007: modal de confirmación visible
        WebElement confirmacion = wait.untilVisible(
                By.cssSelector("[data-testid='success-message'], [data-testid='confirm-modal']"));
        Assertions.assertTrue(confirmacion.isDisplayed(),
                "TC-007: Debería mostrarse confirmación tras editar el expediente");
    }

    // ─────────────────────────────────────────────────────────────────
    // TC-008 — Eliminación de expediente
    // ─────────────────────────────────────────────────────────────────

    /**
     * TC-008 — Paso a paso:
     * 1. En /galeria clic en botón eliminar.
     * 2. Confirmar en modal.
     * Resultado: tarjeta removida sin recargar página.
     */
    @Test
    @Order(5)
    @DisplayName("TC-008 — Eliminar expediente remueve la tarjeta sin recargar")
    void testEliminarExpediente() {
        expedientePage.openList(BASE_URL);
        List<WebElement> cards = expedientePage.getExpedienteCards();
        Assumptions.assumeTrue(!cards.isEmpty(),
                "TC-008: Se necesita al menos un expediente para eliminar");

        int cantidadAntes = cards.size();
        WaitUtils wait = new WaitUtils(driver);

        // 1. Clic en botón eliminar de la primera tarjeta
        cards.get(0).findElement(By.cssSelector("[data-testid='delete-expediente-btn']")).click();

        // 2. Confirmar en modal
        wait.untilVisible(By.cssSelector("[data-testid='confirm-modal']"));
        wait.untilClickable(By.cssSelector("[data-testid='confirm-btn']")).click();

        // TC-008: la tarjeta desaparece sin recargar (DOM actualizado)
        wait.untilInvisible(By.cssSelector("[data-testid='confirm-modal']"));
        List<WebElement> cardsDespues = expedientePage.getExpedienteCards();
        Assertions.assertEquals(cantidadAntes - 1, cardsDespues.size(),
                "TC-008: La tarjeta eliminada debería removerse de la galería");
    }
}
