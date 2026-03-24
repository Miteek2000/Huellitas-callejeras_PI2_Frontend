package com.huellitascallejeras.pages;

import com.huellitascallejeras.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import java.util.List;

public class ExpedientePage {

    private static final String URL_LIST = "/expediente";
    private static final String URL_NEW  = "/expediente/nuevo";

    private final By expedienteCards = By.cssSelector("[data-testid='expediente-card']");
    private final By nombreInput     = By.name("nombre");
    private final By especieSelect   = By.name("especie");
    private final By sexoSelect      = By.name("sexo");
    private final By saveButton      = By.cssSelector("button[type='submit']");
    private final By successMessage  = By.cssSelector("[data-testid='success-message']");
    private final By errorMessage    = By.cssSelector("[data-testid='error-message']");

    private final WebDriver driver;
    private final WaitUtils wait;

    public ExpedientePage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WaitUtils(driver);
    }

    public void openList(String baseUrl) {
        driver.get(baseUrl + URL_LIST);
    }

    public void openNew(String baseUrl) {
        driver.get(baseUrl + URL_NEW);
    }

    public List<WebElement> getExpedienteCards() {
        return driver.findElements(expedienteCards);
    }

    public void fillNombre(String nombre) {
        var field = wait.untilVisible(nombreInput);
        field.clear();
        field.sendKeys(nombre);
    }

    public void selectEspecie(String especie) {
        new Select(wait.untilVisible(especieSelect)).selectByVisibleText(especie);
    }

    public void selectSexo(String sexo) {
        new Select(wait.untilVisible(sexoSelect)).selectByVisibleText(sexo);
    }

    public void submit() {
        wait.untilClickable(saveButton).click();
    }

    public String getSuccessMessage() {
        return wait.untilVisible(successMessage).getText();
    }

    public String getErrorMessage() {
        return wait.untilVisible(errorMessage).getText();
    }
}
