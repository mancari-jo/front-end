/**
 * @param {number || string} salary gaji.
 * @returns {string} gaji
 */
function convertToProperSalaryString(salary) {
  return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default convertToProperSalaryString;
