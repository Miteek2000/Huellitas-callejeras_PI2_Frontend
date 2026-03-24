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
import org.openqa.selenium.support.ui.Select;

import java.io.File;
import java.io.IOException;
import java.util.List;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class MovimientoTest {

    private static final String BASE_URL      = System.getenv("BASE_URL") != null
            ? System.getenv("BASE_URL") : "http://localhost:3000";
    private static final String TESTDATA_PATH = "resources/testdata/test_data.json";

    private static WebDriver driver;
    private static JsonNode  testData;
    private ExpedientePage expedientePage;
    private WaitUtils wait;

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
        wait           = new WaitUtils(driver);
    }

    @Test
    @Order(1)
    @DisplayName("TC-009 — El botón de historial abre el modal de movimientos")
    void testHistorialMovimientosAbreModal() {
        expedientePage.openList(BASE_URL);
        List<WebElement> cards = expedientePage.getExpedienteCards();
        Assumptions.assumeTrue(!cards.isEmpty(),
                "TC-009: Se necesita al menos un expediente");

        WebElement historialBtn = cards.get(0)
                .findElement(By.cssSelector("[data-testid='historial-btn']"));
        historialBtn.click();
        WebElement modal = wait.untilVisible(
                By.cssSelector("[data-testid='historial-modal']"));
        Assertions.assertTrue(modal.isDisplayed(),
                "TC-009: El modal de historial debería estar visible");
    }

    /**
     * TC-009 — Paso a paso:
     * 1. Abrir expediente.
     * 2. Seleccionar tipo de movimiento y motivo compatibles (Selects, no sendKeys).
     * 3. Ingresar fecha.
     * 4. Guardar.
     * Resultado: movimiento creado vía POST /movements, aparece en historial.
     */
    @Test
    @Order(2)
    @DisplayName("TC-009 — Registrar movimiento con tipo/motivo/fecha y verificar en historial")
    void testRegistrarMovimientoExitoso() {
        expedientePage.openList(BASE_URL);
        List<WebElement> cards = expedientePage.getExpedienteCards();
        Assumptions.assumeTrue(!cards.isEmpty(),
                "TC-009: Se necesita al menos un expediente");

        String tipo        = testData.at("/movimientos/valido/tipo").asText();
        String motivo      = testData.at("/movimientos/valido/motivo").asText();
        String fecha       = testData.at("/movimientos/valido/fecha").asText();
        String descripcion = testData.at("/movimientos/valido/descripcion").asText();

        // Abrir el expediente
        cards.get(0).click();

        // Clic en "Nuevo movimiento"
        WebElement btn = wait.untilClickable(
                By.cssSelector("[data-testid='nuevo-movimiento-btn']"));
        btn.click();

        // Seleccionar tipo (Select, no sendKeys)
        WebElement tipoSelect = wait.untilVisible(By.name("tipoMovimiento"));
        new Select(tipoSelect).selectByVisibleText(tipo);

        // Seleccionar motivo (compatible con el tipo elegido)
        WebElement motivoSelect = wait.untilVisible(By.name("motivo"));
        new Select(motivoSelect).selectByVisibleText(motivo);

        // Ingresar fecha
        WebElement fechaInput = wait.untilVisible(By.name("fecha"));
        fechaInput.clear();
        fechaInput.sendKeys(fecha);

        // Descripción opcional
        if (!descripcion.isEmpty()) {
            WebElement descInput = wait.untilVisible(By.name("descripcion"));
            descInput.clear();
            descInput.sendKeys(descripcion);
        }

        // Guardar
        wait.untilClickable(By.cssSelector("[data-testid='guardar-movimiento-btn']")).click();

        // Verificar: mensaje de éxito
        WebElement success = wait.untilVisible(
                By.cssSelector("[data-testid='success-message']"));
        Assertions.assertTrue(success.isDisplayed(),
                "TC-009: Debería mostrar confirmación del movimiento");

        // Verificar: aparece en el historial
        WebElement historialBtn = wait.untilVisible(
                By.cssSelector("[data-testid='historial-btn']"));
        historialBtn.click();

        WebElement historialModal = wait.untilVisible(
                By.cssSelector("[data-testid='historial-modal']"));
        List<WebElement> movimientos = historialModal.findElements(
                By.cssSelector("[data-testid='movimiento-row']"));
        Assertions.assertFalse(movimientos.isEmpty(),
                "TC-009: El movimiento recién creado debería aparecer en el historial");
    }
}
