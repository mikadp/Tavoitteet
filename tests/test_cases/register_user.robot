*** Settings ***
Library    SeleniumLibrary
Library    Collections
Library    Process
Library    OperatingSystem
Resource    ../resources/variables.robot

*** Test Cases ***
Navigate To Homepage And Register New User
    Log    Starting test case: Navigate To Homepage And Register New User
    # Cleanup any existing Chrome processes
    Run Process    pkill    -f    chrome
    Log    Cleaned up existing Chrome processes
    # Wait a bit to ensure all processes are terminated
    Sleep    5s

    Open Browser    ${HOMEPAGE_URL}    ${BROWSER}
    Log    Browser opened successfully
    Click Link    Rekisteröidy
    Log    Clicked on 'Rekisteröidy' link
    Input Text    id=Username    ${USERNAME}
    Input Text    id=Password    ${PASSWORD}
    Click Button    id=Register
    Page Should Contain    Registration successful
    [Teardown]    Custom Teardown
    Log    Test case completed

Custom Teardown
    Close Browser
    Log    Browser closed
    Run Process    pkill    -f    chrome
    Log    Killed any remaining Chrome processes
    Sleep    5s

Remove Directory
    [Arguments]    ${directory}
    Log    Removing directory: ${directory}
    Run Process    rm    -rf    ${directory}
    Log    Directory removed successfully
