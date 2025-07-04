import { Ensure, equals } from "@serenity-js/assertions";
import { actorCalled } from "@serenity-js/core";
import { By, Navigate, PageElement, Text } from "@serenity-js/web";

import { GitHubStatus } from "../serenity/github-api/GitHubStatus";
import { TodoList } from "../serenity/todo-list-app/TodoList";

/**
 * Serenity/JS Screenplay Pattern test scenarios use one or more actors to represent people and external systems
 * interacting with the system under test.
 *
 * To design a test scenario, give each actor a series of tasks and interactions to perform
 * and instruct them to answer questions about the state of the system under test
 * to ensure that the answers meet the expected results.
 *
 * This example test file demonstrates several ways of writing test scenarios using the Screenplay Pattern.
 *
 * Learn more:
 * - Serenity/JS Screenplay Pattern - https://serenity-js.org/handbook/design/screenplay-pattern/
 * - Web Testing with Serenity/JS - https://serenity-js.org/handbook/web-testing/
 * - API Testing with Serenity/JS - https://serenity-js.org/handbook/api-testing/
 * - Serenity/JS web module - https://serenity-js.org/api/web/
 * - Serenity/JS REST module - https://serenity-js.org/api/rest/
 * - Serenity/JS assertions module - https://serenity-js.org/api/assertions/
 */
describe("Example", () => {
  /**
   * This is the most basic example of a Serenity/JS Screenplay Pattern test scenario.
   *
   * This scenario uses a single actor configured to perform a series of web-based interactions,
   * and uses only the low-level abstractions provided by the Serenity/JS web module.
   */
  it("offers a web testing tutorial", async () => {
    await actorCalled("Alice").attemptsTo(
      Navigate.to("https://serenity-js.org"),
      Ensure.that(
        Text.of(PageElement.located(By.id("cta-start-automating"))),
        equals("Start automating 🚀"),
      ),
    );
  });

  /**
   * This is a more advanced example of a Serenity/JS Screenplay Pattern test scenario.
   *
   * This scenario uses two actors:
   * - Apisitt, responsible for interacting with an API to check if the system is up and running before performing any UI checks
   * - Wendy, responsible for interacting with the website to perform the actual acceptance test
   *
   * In this scenario, rather than list all the interactions in the test itself, we use:
   * - API Actions Class Pattern to group tasks concerning interacting with the GitHubStatus API
   * - Screenplay Pattern flavour of Page Objects to group tasks and questions concerning interacting with the Serenity/JS Todo List app
   *
   * Note that apart from strongly encouraging the Screenplay Pattern,
   * Serenity/JS doesn't require you to organise your code in any particular way.
   * This gives you the freedom to choose patterns and abstractions that work best for you, your team,
   * and reflect the domain of your system under test.
   */
  it(`offers examples to help you practice test automation`, async () => {
    // You can use API interactions to manage test data, or to ensure services are up and running before performing any UI checks.
    // Since Serenity/JS demo website is deployed to GitHub Pages,
    // before interacting with the website we ensure that GitHub itself is up and running.
    await actorCalled("Apisitt").attemptsTo(GitHubStatus.ensureAllSystemsOperational());

    // Once we know the system is up and running, Wendy can proceed with the web-based scenario.
    await actorCalled("Wendy").attemptsTo(
      TodoList.createListContaining([`Buy dog food`, `Feed the dog`, `Book a vet's appointment`]),
      TodoList.markAsCompleted([`Buy dog food`, `Feed the dog`]),
      Ensure.that(TodoList.outstandingItemsCount(), equals(1)),
    );
  });
});
