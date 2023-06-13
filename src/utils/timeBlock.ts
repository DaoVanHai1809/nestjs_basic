export const blockTime = (minute:number, second:number) => {
    return Math.floor((minute * 60 + second) / (15 * 60)) + 1;
}