export function stringToCamelCase(string) {
    if (!string) {
        return "";
    }

    return string.split(" ").map((word, i) => {
        if (i == 0) return word.toLowerCase();
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
    }).join("");
}