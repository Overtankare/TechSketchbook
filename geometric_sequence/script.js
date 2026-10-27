document.addEventListener("DOMContentLoaded", function() {
    const calculateBtn = document.getElementById("calculate");
    const firstTermInput = document.getElementById("first_term");
    const termNumberInput = document.getElementById("term_number");
    const commonRatioInput = document.getElementById("common_ratio");
    const valueOutput = document.getElementById("result");
    let value;
    function calculate() {
        const firstTerm = Number(firstTermInput.value);
        const termNumber = Number(termNumberInput.value);
        const commonRatio = Number(commonRatioInput.value);
        value = firstTerm * (commonRatio ** (termNumber - 1));
        valueOutput.textContent = "Result: " + value;
    }
    calculateBtn.addEventListener("click", function() {calculate();});
})