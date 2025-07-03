*** Settings ***
Library    SeleniumLibrary
Library    Collections
Library    Process
Library    OperatingSystem
Resource    ../resources/variables.robot

*** Test Cases ***
Navigate To Homepage And Register New User
    Log    Starting test case: Navigate To Homepage And Register New User   INFO

    # Generate a random string for a unique directory
    ${RANDOM_STRING}=    Generate Random String    10
    Log     Generated random string: ${RANDOM_STRING}   INFO
    Set Test Variable    ${RANDOM_STRING}

    # Create a directory for the user data
    ${DIRECTORY}=   Set Variable    /tmp/chrome-user-data-${RANDOM_STRING}
    Create Directory    ${DIRECTORY}
    Log     Directory created successfully  INFO

    # Configure Chrome options
    ${CHROME_OPTIONS}=    Set Chrome Options    ${RANDOM_STRING}
    Log    Chrome options set   INFO

    # Open the browser with the specified options
    Open Browser    ${HOMEPAGE_URL}    chrome    options=${CHROME_OPTIONS}
    Log     Browser opened  INFO

    # Test steps
    Click Link    Rekisteröidy
    Log    Clicked on 'Rekisteröidy' link   INFO
    Input Text    id=Username    ${USERNAME}
    Input Text    id=Password    ${PASSWORD}
    Click Button    id=Register
    Page Should Contain    Registration successful

    [Teardown]    Custom Teardown    ${RANDOM_STRING}
    Log    Test case completed  INFO

*** Keywords ***
Generate Random String
    [Arguments]    ${length}
    ${random_string}=    Evaluate    ''.join(random.choices(string.ascii_letters + string.digits, k=int(${length})))    random, string
    Log    Generated random string: ${random_string}    INFO
    RETURN    ${random_string}

Set Chrome Options
    [Arguments]    ${random_string}
    Log    Setting Chrome options with random string: ${random_string}    INFO
    ${chrome_options}=    Evaluate    selenium.webdriver.ChromeOptions()    selenium.webdriver
    Call Method    ${chrome_options}    add_argument    --no-sandbox
    Call Method    ${chrome_options}    add_argument    --disable-dev-shm-usage
    ${arg}=    Set Variable    --user-data-dir=/tmp/chrome-user-data-${random_string}
    Log    User data dir argument: ${arg}  INFO
    Call Method    ${chrome_options}    add_argument    ${arg}
    RETURN    ${chrome_options}

Create Directory
    [Arguments]    ${directory}
    Log    Creating directory: ${directory} INFO
    Run Process    mkdir    -p    ${directory}
    Log    Directory ${directory} created successfully  INFO

Custom Teardown
    [Arguments]    ${random_string}
    Log    Running custom teardown for random string: ${random_string}  INFO
    Close Browser
    Log    Browser closed   INFO
    Remove Directory    /tmp/chrome-user-data-${random_string}
    Log    Directory removed: /tmp/chrome-user-data-${random_string}    INFO

Remove Directory
    [Arguments]    ${directory}
    Log    Removing directory: ${directory} INFO
    Run Process    rm    -rf    ${directory}
    Log    Directory removed successfully   INFO
