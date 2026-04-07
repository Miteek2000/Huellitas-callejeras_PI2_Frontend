package com.huellitascallejeras.tests;

import com.huellitascallejeras.utils.AuthUtils;
import com.huellitascallejeras.utils.DriverManager;
import com.huellitascallejeras.utils.WaitUtils;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.IOException;
import java.util.List;

/**
 * TC-015 — Navegación del header: todos los iconos dirigen correctamente.
 *
 * Links reales según Header.tsx:
 *  - Hogar  (Hogar.svg)        → /galeria
 *  - Config (Configuracion.svg) → /colaboradores  (solo para no-colaboradores)
 *  - Estadísticas              → botón sin href (sin navegación actualmente)
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class NavigationTest {

    private static final String BASE_URL = System.getenv("BASE_URL") != null
            ? System.getenv("BASE_URL") : "http://localhost:3000";

    private static WebDriver driver;
    private WaitUtils wait;

    @BeforeAll
    static void setUp() throws IOException {
        driver = DriverManager.getDriver();
        // TC-015 verifica navegación como propietario (ve todos los iconos)
        new AuthUtils(driver).loginAsOwner();
    }

    @AfterAll
    static void tearDown() {
        DriverManager.quitDriver();
    }

    @BeforeEach
    void init() {
        wait = new WaitUtils(driver);
    }

    // ─────────────────────────────────────────────────────────────────
    // TC-015 — Navegación del header
    // ─────────────────────────────────────────────────────────────────

    @Test
    @Order(1)
    @DisplayName("TC-015 — El header está presente en todas las páginas autenticadas")
    void tc015_headerVisible() {
        driver.get(BASE_URL + "/galeria");
        WebElement header = wait.untilVisible(By.cssSelector("header"));
        Assertions.assertTrue(header.isDisplayed(),
                "TC-015: El header debe ser visible en páginas autenticadas");
    }

    @Test
    @Order(2)
    @DisplayName("TC-015 — Ícono Hogar redirige a /galeria")
    void tc015_iconoHogarRedirigeAGaleria() {
        // Navegar a otra sección para probar la vuelta
        driver.get(BASE_URL + "/colaboradores");
        wait.untilVisible(By.cssSelector("header"));

        // Clic en el enlace /galeria del header (ícono Hogar)
        WebElement hogarLink = wait.untilClickable(
                By.cssSelector("header a[href='/galeria']"));
        hogarLink.click();

        wait.untilUrlContains("/galeria");
        Assertions.assertTrue(
                driver.getCurrentUrl().contains("/galeria"),
                "TC-015: El ícono Hogar debe redirigir a /galeria");
    }

    @Test
    @Order(3)
    @DisplayName("TC-015 — Ícono Configuración redirige a /colaboradores")
    void tc015_iconoConfiguracionRedirigeAColaboradores() {
        driver.get(BASE_URL + "/galeria");
        wait.untilVisible(By.cssSelector("header"));

        // Clic en el enlace /colaboradores del header (ícono Configuración)
        WebElement configLink = wait.untilClickable(
                By.cssSelector("header a[href='/colaboradores']"));
        configLink.click();

        wait.untilUrlContains("/colaboradores");
        Assertions.assertTrue(
                driver.getCurrentUrl().contains("/colaboradores"),
                "TC-015: El ícono Configuración debe redirigir a /colaboradores");
    }

    @Test
    @Order(4)
    @DisplayName("TC-015 — Ícono Estadísticas está visible en el header")
    void tc015_iconoEstadisticasVisible() {
        driver.get(BASE_URL + "/galeria");
        wait.untilVisible(By.cssSelector("header"));

        // El botón de estadísticas existe en el header aunque no tenga href aún
        List<WebElement> statsBtn = driver.findElements(
                By.cssSelector("header button img[alt='Estadísticas']"));
        // Buscar también por alt text del img dentro del botón
        if (statsBtn.isEmpty()) {
            statsBtn = driver.findElements(
                    By.xpath("//header//button[.//img[@alt='Estadísticas']]"));
        }
        Assertions.assertFalse(statsBtn.isEmpty(),
                "TC-015: El ícono de Estadísticas debe estar presente en el header");
        Assertions.assertTrue(statsBtn.get(0).isDisplayed(),
                "TC-015: El ícono de Estadísticas debe ser visible");
    }

    @Test
    @Order(5)
    @DisplayName("TC-015 — El título 'Huellitas Callejeras' es visible en el header")
    void tc015_tituloPrincipalVisible() {
        driver.get(BASE_URL + "/galeria");
        wait.untilVisible(By.cssSelector("header"));

        WebElement titulo = wait.untilVisible(By.cssSelector("header h1"));
        Assertions.assertTrue(
                titulo.getText().toLowerCase().contains("huellitas"),
                "TC-015: El header debe mostrar el título 'Huellitas Callejeras'");
    }

    @Test
    @Order(6)
    @DisplayName("TC-015 — Ícono Configuración NO visible para colaborador")
    void tc015_iconoConfiguracionOcultoParaColaborador() throws IOException {
        // Cerrar sesión y entrar como colaborador
        new AuthUtils(driver).loginAsColaborador();

        driver.get(BASE_URL + "/galeria");
        wait.untilVisible(By.cssSelector("header"));

        List<WebElement> configLink = driver.findElements(
                By.cssSelector("header a[href='/colaboradores']"));
        Assertions.assertTrue(
                configLink.isEmpty() || !configLink.get(0).isDisplayed(),
                "TC-015: El ícono Configuración no debe ser visible para un colaborador");

        // Volver a sesión de propietario para los tests siguientes
        new AuthUtils(driver).loginAsOwner();
    }
}
