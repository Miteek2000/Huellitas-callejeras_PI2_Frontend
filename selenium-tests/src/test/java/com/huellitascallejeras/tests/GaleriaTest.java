package com.huellitascallejeras.tests;

import com.huellitascallejeras.pages.GaleriaPage;
import com.huellitascallejeras.utils.AuthUtils;
import com.huellitascallejeras.utils.DriverManager;
import com.huellitascallejeras.utils.WaitUtils;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.IOException;
import java.util.List;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class GaleriaTest {

    private static final String BASE_URL = System.getenv("BASE_URL") != null
            ? System.getenv("BASE_URL") : "http://localhost:3000";

    private static WebDriver driver;
    private GaleriaPage galeriaPage;

    @BeforeAll
    static void setUp() throws IOException {
        driver = DriverManager.getDriver();
        // La galería requiere sesión iniciada
        new AuthUtils(driver).loginAsDefaultUser();
    }

    @AfterAll
    static void tearDown() {
        DriverManager.quitDriver();
    }

    @BeforeEach
    void initPage() {
        galeriaPage = new GaleriaPage(driver);
    }

    // ─────────────────────────────────────────────────────────────────
    // TC-010 — Búsqueda de animal por nombre en galería
    // ─────────────────────────────────────────────────────────────────

    /**
     * TC-010 — Paso a paso:
     * 1. En /galeria ingresar nombre en el buscador.
     * 2. Verificar que solo aparecen coincidencias.
     * Resultado: tarjetas filtradas en tiempo real, sin petición adicional al backend.
     */
    @Test
    @Order(1)
    @DisplayName("TC-010 — La galería carga tarjetas de animales al abrirse")
    void tc010_galeriaMuestraAnimales() {
        galeriaPage.open(BASE_URL);
        galeriaPage.waitForGallery();
        List<WebElement> cards = galeriaPage.getAnimalCards();
        Assertions.assertFalse(cards.isEmpty(),
                "TC-010: La galería debería mostrar al menos una tarjeta de animal");
    }

    @Test
    @Order(2)
    @DisplayName("TC-010 — Buscar por nombre filtra las tarjetas en tiempo real")
    void tc010_busquedaPorNombreFiltrasCards() {
        galeriaPage.open(BASE_URL);
        galeriaPage.waitForGallery();

        List<WebElement> cardsTotales = galeriaPage.getAnimalCards();
        Assumptions.assumeTrue(!cardsTotales.isEmpty(),
                "TC-010: Se necesita al menos una tarjeta para el test de búsqueda");

        // Obtener el nombre del primer animal para buscar por él
        String nombreAnimal = cardsTotales.get(0)
                .findElement(By.cssSelector("[data-testid='animal-nombre']"))
                .getText();

        galeriaPage.search(nombreAnimal);

        // Esperar que el filtro se aplique (sin esperar petición, es en tiempo real)
        WaitUtils wait = new WaitUtils(driver, 3);
        List<WebElement> cardsFiltradas = galeriaPage.getAnimalCards();

        Assertions.assertFalse(cardsFiltradas.isEmpty(),
                "TC-010: Debería haber al menos un resultado al buscar por nombre exacto");

        // Todos los resultados deben contener el término buscado
        boolean todasCoinciden = cardsFiltradas.stream()
                .allMatch(card -> {
                    String nombre = card.findElement(
                            By.cssSelector("[data-testid='animal-nombre']")).getText();
                    return nombre.toLowerCase().contains(nombreAnimal.toLowerCase());
                });

        Assertions.assertTrue(todasCoinciden,
                "TC-010: Todos los resultados filtrados deben contener el nombre buscado");
    }

    @Test
    @Order(3)
    @DisplayName("TC-010 — Búsqueda sin coincidencias muestra estado vacío")
    void tc010_busquedaSinCoincidenciasMuestraEstadoVacio() {
        galeriaPage.open(BASE_URL);
        galeriaPage.waitForGallery();

        // Término que no debería coincidir con ningún animal
        galeriaPage.search("xyzAnimalInexistente99999");

        WaitUtils wait = new WaitUtils(driver, 3);
        List<WebElement> cards = galeriaPage.getAnimalCards();

        Assertions.assertTrue(cards.isEmpty(),
                "TC-010: Una búsqueda sin coincidencias debería mostrar lista vacía");
    }

    @Test
    @Order(4)
    @DisplayName("TC-010 — Limpiar búsqueda restaura todas las tarjetas")
    void tc010_limpiarBusquedaRestauraCards() {
        galeriaPage.open(BASE_URL);
        galeriaPage.waitForGallery();

        int totalInicial = galeriaPage.getAnimalCards().size();

        galeriaPage.search("Pelusa");
        galeriaPage.search(""); // limpiar buscador

        List<WebElement> cardsPostLimpieza = galeriaPage.getAnimalCards();
        Assertions.assertEquals(totalInicial, cardsPostLimpieza.size(),
                "TC-010: Al limpiar la búsqueda deben restaurarse todas las tarjetas");
    }
}
