// features/ArithmeticSteps.ts

import { binding, given, then } from 'cucumber-tsflow';

@binding()
class ArithmeticSteps {
  private computedResult: number;

  @given(/I enter '(\d*)' and '(\d*)'/)
  public givenTwoNumbers(num1: string, num2: string): void {
    this.computedResult = parseInt(num1) + parseInt(num2);
  }

  @then(/I receive the result '(\d*)'/)
  public thenResultReceived(expectedResult: string): void {
    if (parseInt(expectedResult) !== this.computedResult) {
      throw new Error('Arithmetic Error');
    }
  }
}

export = ArithmeticSteps;
