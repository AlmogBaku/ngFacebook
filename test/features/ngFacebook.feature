Feature: ngFacebook
  Scenario: Facebook load
    Given angular webpage with ngFacebook
    Then facebook sdk should be loaded
  Scenario: Login
    Given an anonymous state
    When I login with facebook user "charlie_hportxj_chaplin@tfbnw.net" with password "1234"
    Then I should be logged in
    Then my name is "Charlie Chaplin"
  Scenario: cachedApi- friends list
    When I getting the list of my friends
    Then I should see "Marilyn Monroe" as a friend of mine