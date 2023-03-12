const $ = (selector) => document.querySelector(selector);

class Calculator {
  constructor() {
    this.result = 0;
    this.innitEventListeners();
  }

  validate(num1, num2) {
    if (num1 > 999 || num2 > 999) {
      throw new Error("최대 세자리의 숫자까지 입력이 가능합니다.");
    }
  }

  sum(num1, num2) {
    this.validate(num1, num2);
    return Math.floor(num1 + num2);
  }

  subtract(num1, num2) {
    this.validate(num1, num2);
    return Math.floor(num1 - num2);
  }

  multiply(num1, num2) {
    this.validate(num1, num2);
    return Math.floor(num1 * num2);
  }

  divide(num1, num2) {
    this.validate(num1, num2);
    return Math.floor(num1 / num2);
  }

  clear() {
    this.result = 0;
    $("#num1").value = "";
    $("#num2").value = "";
    $("#operator").value = "sum";
    $("#result").value = "";
  }

  calculate(operator, num1, num2) {
    const operatorMap = {
      sum: this.sum,
      subtract: this.subtract,
      multiply: this.multiply,
      divide: this.divide,
    };

    return operatorMap[operator].bind(this)(num1, num2);
  }

  printResult() {
    $("#result").innerText = this.result;
  }

  innitEventListeners() {
    $("#submit").addEventListener("click", () => {
      const num1 = Number($("#num1").value);
      const num2 = Number($("#num2").value);
      const operator = $("#operator").value;

      this.result = this.calculate(operator, num1, num2);
      this.printResult();
    });

    $("#AC").addEventListener("click", () => {
      this.clear();
    });
  }
}

const calculator = new Calculator();
