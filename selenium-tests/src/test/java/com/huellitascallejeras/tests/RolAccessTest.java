package com.huellitascallejeras.tests;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huellitascallejeras.pages.ColaboradoresPage;
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

/**
 * TC-011 — Control de acceso: colaboradores no pueden crear expediente.
 * TC-012 — Control de acceso: colaboradores no pueden acceder a /colaboradores.
 * TC-013 — Agregar colaboradores al refugio como propietario.
 * TC-014 — Cambio de estado del animal en expediente.
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RolAccessTest {

    private static final String BASE_URL      = System.getenv("BASE_URL") != null
            ? System.getenv("BASE_URL") : "http://localhost:3000";
    private static final String TESTDATA_PATH = "resources/testdata/test_data.json";

    private static WebDriver driver;
    private static JsonNode  testData;
    private AuthUtils authUtils;

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
    void initAuth() {
        authUtils = new AuthUtils(driver);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TC-011: Control de acceso — colaboradores no pueden crear expediente
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-011 — Paso a paso:
     * 1. Iniciar sesión como colaborador.
     * 2. Intentar acceder a /expediente/nuevo.
     * 3. Verificar redirección (no puede ingresar).
     * 4. Botón "agregar" no visible en la galería.
     */
    @Test
    @Order(1)
    @DisplayName("TC-011 — Colaborador es redirigido al intentar acceder a /expediente/nuevo")
    void tc011_colaboradorNoAccedeANuevoExpediente() throws IOException {
        authUtils.loginAsColaborador();

        // Intentar navegar directamente a la ruta protegida
        driver.get(BASE_URL + "/expediente/nuevo");

        WaitUtils wait = new WaitUtils(driver);
        // Esperar redirección
        wait.untilUrlContains("/");

        // No debe estar en /expediente/nuevo
        Assertions.assertFalse(
                driver.getCurrentUrl().contains("/expediente/nuevo"),
                "TC-011: Un colaborador no debería poder acceder a /expediente/nuevo");
    }

    @Test
    @Order(2)
    @DisplayName("TC-011 — Colaborador no ve el botón de agregar expediente en la galería")
    void tc011_colaboradorNoBtnAgregarExpediente() throws IOException {
        authUtils.loginAsColaborador();

        driver.get(BASE_URL + "/galeria");

        // El botón "agregar" / "nuevo expediente" no debe estar visible
        List<WebElement> addBtn = driver.findElements(
                By.cssSelector("[data-testid='nuevo-expediente-btn']"));
        Assertions.assertTrue(
                addBtn.isEmpty() || !addBtn.get(0).isDisplayed(),
                "TC-011: El colaborador no debería ver el botón para crear un nuevo expediente");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TC-012: Control de acceso — colaboradores no pueden acceder a /colaboradores
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-012 — Paso a paso:
     * 1. Iniciar sesión como colaborador.
     * 2. Intentar navegar a /colaboradores.
     * 3. Verificar que el ícono de Configuración no está visible en el header.
     */
    @Test
    @Order(3)
    @DisplayName("TC-012 — Colaborador es redirigido al intentar acceder a /colaboradores")
    void tc012_colaboradorNoAccedeAColaboradores() throws IOException {
        authUtils.loginAsColaborador();

        driver.get(BASE_URL + "/colaboradores");

        WaitUtils wait = new WaitUtils(driver);
        wait.untilUrlContains("/");

        Assertions.assertFalse(
                driver.getCurrentUrl().contains("/colaboradores"),
                "TC-012: Un colaborador no debería poder acceder a /colaboradores");
    }

    @Test
    @Order(4)
    @DisplayName("TC-012 — Ícono de Configuración no visible en el header para colaborador")
    void tc012_iconoConfiguracionOcultoParaColaborador() throws IOException {
        authUtils.loginAsColaborador();

        driver.get(BASE_URL + "/galeria");
        new WaitUtils(driver).untilVisible(By.cssSelector("header"));

        // El enlace a /colaboradores (ícono Configuración) no debe estar en el DOM
        // o no debe estar visible — según Header.tsx usa {!isColaborador && (...)}
        List<WebElement> configLink = driver.findElements(
                By.cssSelector("header a[href='/colaboradores']"));
        Assertions.assertTrue(
                configLink.isEmpty() || !configLink.get(0).isDisplayed(),
                "TC-012: El ícono de Configuración no debería ser visible para un colaborador");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TC-013: Agregar colaboradores al refugio como propietario
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-013 — Paso a paso:
     * 1. Iniciar sesión como propietario.
     * 2. Ir a /colaboradores.
     * 3. Clic en "Agregar".
     * 4. Completar el formulario.
     * 5. Clic en "Guardar".
     * Resultado esperado: usuario creado en BD con rol asignado, aparece en la tabla.
     */
    @Test
    @Order(5)
    @DisplayName("TC-013 — Propietario puede agregar un colaborador al refugio")
    void tc013_propietarioAgregaColaborador() throws IOException {
        // 1. Login como propietario
        authUtils.loginAsOwner();

        // 2. Ir a /colaboradores
        ColaboradoresPage page = new ColaboradoresPage(driver);
        page.open(BASE_URL);

        int rowsAntes = page.getRows().size();

        // 3. Clic en "Agregar"
        page.clickNew();

        // 4. Completar formulario
        String nombre = testData.at("/colaboradores/valido/nombre").asText();
        String email  = testData.at("/colaboradores/valido/email").asText();
        String rol    = testData.at("/colaboradores/valido/rol").asText();
        page.fillForm(nombre, email, rol);

        // 5. Guardar
        page.save();

        // Verificar: toast de éxito visible
        String toast = page.getSuccessToast();
        Assertions.assertFalse(toast.isEmpty(),
                "TC-013: Debería mostrarse notificación de éxito al guardar colaborador");

        // Verificar: aparece en la tabla (una fila más)
        page.open(BASE_URL); // recarga para confirmar persistencia
        int rowsDespues = page.getRows().size();
        Assertions.assertTrue(rowsDespues > rowsAntes,
                "TC-013: El colaborador debería aparecer en la tabla tras ser guardado");
    }

    @Test
    @Order(6)
    @DisplayName("TC-013 — Formulario de colaborador es inaccesible sin rol propietario")
    void tc013_sinRolPropietarioNoAccede() throws IOException {
        // Login con usuario estándar (no propietario)
        authUtils.loginAsDefaultUser();

        driver.get(BASE_URL + "/colaboradores");

        // Debe redirigir o no mostrar el botón de agregar
        List<WebElement> addBtn = driver.findElements(
                By.cssSelector("[data-testid='nuevo-colaborador-btn']"));
        Assertions.assertTrue(addBtn.isEmpty() || !addBtn.get(0).isDisplayed(),
                "TC-013: Un usuario sin rol propietario no debería ver el botón de agregar colaborador");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TC-014: Cambio de estado del animal en expediente
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-014 — Paso a paso:
     * 1. Abrir el expediente en modo edición.
     * 2. Clic en botón de estado.
     * 3. Seleccionar nuevo estado.
     * 4. Clic en "Confirmar".
     * Resultado esperado: estado actualizado en BD via PATCH, modal de confirmación visible.
     */
    @Test
    @Order(7)
    @DisplayName("TC-014 — Cambio de estado del animal en expediente muestra confirmación")
    void tc014_cambioEstadoAnimal() throws IOException {
        authUtils.loginAsDefaultUser();

        ExpedientePage expedientePage = new ExpedientePage(driver);
        expedientePage.openList(BASE_URL);

        List<WebElement> cards = expedientePage.getExpedienteCards();
        Assumptions.assumeTrue(!cards.isEmpty(),
                "TC-014: Se necesita al menos un expediente para ejecutar este test");

        // 1. Abrir expediente en modo edición
        WebElement editBtn = cards.get(0)
                .findElement(By.cssSelector("[data-testid='edit-expediente-btn']"));
        editBtn.click();

        WaitUtils wait = new WaitUtils(driver);

        // 2. Clic en botón de estado
        WebElement statusBtn = wait.untilClickable(
                By.cssSelector("[data-testid='estado-btn']"));
        statusBtn.click();

        // 3. Seleccionar nuevo estado desde el dropdown/modal
        String nuevoEstado = testData.at("/animales/nuevoEstado").asText("En adopción");
        WebElement statusOption = wait.untilClickable(
                By.cssSelector("[data-testid='estado-option'][data-value='" + nuevoEstado + "']"));
        statusOption.click();

        // 4. Clic en "Confirmar"
        WebElement confirmBtn = wait.untilClickable(
                By.cssSelector("[data-testid='confirm-btn']"));
        confirmBtn.click();

        // Verificar: modal de confirmación visible
        WebElement confirmacionModal = wait.untilVisible(
                By.cssSelector("[data-testid='confirm-modal'], [data-testid='success-message']"));
        Assertions.assertTrue(confirmacionModal.isDisplayed(),
                "TC-014: Debería mostrarse confirmación tras cambiar el estado del animal");
    }

    @Test
    @Order(8)
    @DisplayName("TC-014 — El estado actualizado persiste al recargar el expediente")
    void tc014_estadoPersisteTrasCambio() throws IOException {
        authUtils.loginAsDefaultUser();

        ExpedientePage expedientePage = new ExpedientePage(driver);
        expedientePage.openList(BASE_URL);

        List<WebElement> cards = expedientePage.getExpedienteCards();
        Assumptions.assumeTrue(!cards.isEmpty(),
                "TC-014: Se necesita al menos un expediente para ejecutar este test");

        // Obtener estado actual antes del cambio
        WaitUtils wait = new WaitUtils(driver);
        WebElement firstCard = cards.get(0);
        String estadoAntes = firstCard
                .findElement(By.cssSelector("[data-testid='estado-badge']"))
                .getText();

        // Abrir en modo edición y cambiar estado
        firstCard.findElement(By.cssSelector("[data-testid='edit-expediente-btn']")).click();

        WebElement statusBtn = wait.untilClickable(By.cssSelector("[data-testid='estado-btn']"));
        statusBtn.click();

        // Seleccionar cualquier opción diferente al estado actual
        List<WebElement> options = driver.findElements(
                By.cssSelector("[data-testid='estado-option']"));
        options.stream()
                .filter(o -> !o.getAttribute("data-value").equalsIgnoreCase(estadoAntes))
                .findFirst()
                .ifPresent(WebElement::click);

        wait.untilClickable(By.cssSelector("[data-testid='confirm-btn']")).click();
        wait.untilVisible(By.cssSelector("[data-testid='confirm-modal'], [data-testid='success-message']"));

        // Recargar y verificar que el estado cambió
        expedientePage.openList(BASE_URL);
        cards = expedientePage.getExpedienteCards();
        String estadoDespues = cards.get(0)
                .findElement(By.cssSelector("[data-testid='estado-badge']"))
                .getText();

        Assertions.assertNotEquals(estadoAntes, estadoDespues,
                "TC-014: El estado del animal debería haberse actualizado tras el PATCH");
    }
}
