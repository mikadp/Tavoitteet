*** Settings ***
Library     SeleniumLibrary
Library     Collections
Library     Process
Resource    ../resources/variables.robot

*** Test Cases ***
Navigate To Homepage And Register New User
    ${RANDOM_STRING}=    Generate Random String    10
    Set Test Variable    ${RANDOM_STRING}
    Create Directory    /tmp/chrome-user-data-${RANDOM_STRING}
    ${CHROME_OPTIONS}=    Set Chrome Options    ${RANDOM_STRING}
    #Create WebDriver    Chrome    options=${CHROME_OPTIONS}
    Open Browser    ${HOMEPAGE_URL}    ${BROWSER}    ${CHROME_OPTIONS}
    Click Link    Rekisteröidy
    Input Text    id=Username    ${USERNAME}
    Input Text    id=Password    ${PASSWORD}
    Click Button    id=Register
    Page Should Contain    Registration successful
    [Teardown]    Custom Teardown

*** Keywords ***
Generate Random String
    [Arguments]    ${length}
    ${random_string}=    Evaluate    ''.join(random.choices(string.ascii_letters + string.digits, k=${length}))    modules=random, string
    RETURN    ${random_string}

Set Chrome Options
    [Arguments]    ${random_string}
    ${chrome_options}=    Set Variable    --no-sandbox --disable-dev-shm-usage --user-data-dir=/tmp/chrome-user-data-${random_string}    
    RETURN    ${chrome_options}

Custom Teardown
    Close Browser
    Remove Directory    /tmp/chrome-user-data-${RANDOM_STRING}

Create Directory
    [Arguments]    ${directory}
    Run Process    mkdir    -p    ${directory}

Remove Directory
    [Arguments]    ${directory}
    Run Process    rm    -rf    ${directory}