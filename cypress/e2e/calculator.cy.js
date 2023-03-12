// - [x] 1. 2개의 숫자에 대해 덧셈이 가능하다.
// - [x] 2. 2개의 숫자에 대해 뺄셈이 가능하다.
// - [x] 3. 2개의 숫자에 대해 곱셈이 가능하다.
// - [x] 4. 2개의 숫자에 대해 나눗셈이 가능하다.
// - [x] 5. AC(All Clear) 버튼을 누르면 0으로 초기화 한다.
// - [x] 6. 숫자는 한번에 최대 3자리 수까지 입력 가능하다.
// - [x] 7. 계산 결과를 표현할 때 소수점 이하는 버림한다.

describe("calculator", () => {
  beforeEach(() => {
    cy.viewport("iphone-3");
    cy.visit("../../index.html");
    cy.get("#num1").type(1);
    cy.get("#num2").type(2);
  });

  it("2개의 숫자에 대해 덧셈이 가능하다.", () => {
    cy.get("#operator").select("sum");
    cy.get("#submit").click();
    cy.get("#result").should("have.text", "3");
  });

  it("2개의 숫자에 대해 뺼셈이 가능하다.", () => {
    cy.get("#operator").select("subtract");
    cy.get("#submit").click();
    cy.get("#result").should("have.text", "-1");
  });

  it("2개의 숫자에 대해 곱셈이 가능하다.", () => {
    cy.get("#operator").select("multiply");
    cy.get("#submit").click();
    cy.get("#result").should("have.text", "2");
  });

  it("2개의 숫자에 대해 나눗셈이 가능하다.", () => {
    cy.get("#operator").select("divide");
    cy.get("#submit").click();
    cy.get("#result").should("have.text", "0");
  });

  it("AC(All Clear) 버튼을 누르면 0으로 초기화 한다.", () => {
    cy.get("#operator").select("divide");
    cy.get("#AC").click();
    cy.get("#num1").should("have.text", "");
    cy.get("#num2").should("have.text", "");
  });

  it("숫자는 한번에 최대 세자리 수까지 입력 가능하다.", () => {
    cy.get("#num1").type(111);
    cy.get("#num2").type(222);
    cy.get("#submit").click();
    cy.on("uncaught:exception", (err) => {
      expect(err.message).to.include(
        "최대 세자리의 숫자까지 입력이 가능합니다."
      );
      return false;
    });
  });

  describe("계산 결과를 표현할 때 소수점 이하는 버림한다.", () => {
    beforeEach(() => {
      cy.get("#num1").clear();
      cy.get("#num2").clear();
      cy.get("#num1").type(2.5);
      cy.get("#num2").type(1.3);
    });

    it("소수점 덧셈", () => {
      cy.get("#operator").select("sum");
      cy.get("#submit").click();
      cy.get("#result").should("have.text", "3");
    });

    it("소수점 뺄셈", () => {
      cy.get("#operator").select("subtract");
      cy.get("#submit").click();
      cy.get("#result").should("have.text", "1");
    });

    it("소수점 곱셈", () => {
      cy.get("#operator").select("multiply");
      cy.get("#submit").click();
      cy.get("#result").should("have.text", "3");
    });

    it("소수점 나눗셈", () => {
      cy.get("#operator").select("divide");
      cy.get("#submit").click();
      cy.get("#result").should("have.text", "1");
    });
  });
});
