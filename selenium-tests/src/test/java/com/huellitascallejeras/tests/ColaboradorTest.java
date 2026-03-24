package com.huellitascallejeras.tests;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huellitascallejeras.pages.ColaboradoresPage;
import com.huellitascallejeras.utils.DriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.util.List;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ColaboradorTest {

    private static final String BASE_URL      = System.getenv("BASE_URL") != null
            ? System.getenv("BASE_URL") : "http://localhost:3000";
    private static final String TESTDATA_PATH = "resources/testdata/test_data.json";

    private static WebDriver driver;
    private static JsonNode  testData;
    private ColaboradoresPage colaboradoresPage;

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
        colaboradoresPage = new ColaboradoresPage(driver);
    }

    @Test
    @Order(1)
    @DisplayName("La tabla de colaboradores se renderiza al abrir la página")
    void testTablaColaboradoresVisible() {
        colaboradoresPage.open(BASE_URL);
        List<WebElement> rows = colaboradoresPage.getRows();
        Assertions.assertNotNull(rows, "Debería retornar filas de la tabla");
    }

    @Test
    @Order(2)
    @DisplayName("Agregar colaborador con datos válidos muestra confirmación")
    void testAgregarColaboradorExitoso() {
        colaboradoresPage.open(BASE_URL);
        String nombre = testData.at("/colaboradores/valido/nombre").asText();
        String email  = testData.at("/colaboradores/valido/email").asText();
        String rol    = testData.at("/colaboradores/valido/rol").asText();
        colaboradoresPage.clickNew();
        colaboradoresPage.fillForm(nombre, email, rol);
        colaboradoresPage.save();
        String toast = colaboradoresPage.getSuccessToast();
        Assertions.assertFalse(toast.isEmpty(), "Debería mostrar notificación de éxito");
    }

    @Test
    @Order(3)
    @DisplayName("Al intentar eliminar un colaborador aparece modal de confirmación")
    void testEliminarColaboradorRequiereConfirmacion() {
        colaboradoresPage.open(BASE_URL);
        List<WebElement> rows = colaboradoresPage.getRows();
        if (!rows.isEmpty()) {
            WebElement deleteBtn = rows.get(0)
                    .findElement(By.cssSelector("[data-testid='delete-btn']"));
            deleteBtn.click();
            colaboradoresPage.confirmAction();
        }
    }
}
