package com.huellitascallejeras.pages;

import com.huellitascallejeras.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import java.util.List;

public class GaleriaPage {

    private static final String URL_PATH = "/galeria";

    private final By galleryGrid  = By.cssSelector("[data-testid='gallery-grid']");
    private final By animalCards  = By.cssSelector("[data-testid='animal-card']");
    private final By searchInput  = By.cssSelector("input[type='search']");
    private final By filterSelect = By.cssSelector("[data-testid='filter-select']");

    private final WebDriver driver;
    private final WaitUtils wait;

    public GaleriaPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WaitUtils(driver);
    }

    public void open(String baseUrl) {
        driver.get(baseUrl + URL_PATH);
    }

    public void waitForGallery() {
        wait.untilVisible(galleryGrid);
    }

    public List<WebElement> getAnimalCards() {
        return driver.findElements(animalCards);
    }

    public void search(String term) {
        var field = wait.untilVisible(searchInput);
        field.clear();
        field.sendKeys(term);
    }

    public void selectFilter(String value) {
        new Select(wait.untilVisible(filterSelect)).selectByVisibleText(value);
    }
}
