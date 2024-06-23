export function strToArray(str: string, limit: number, lineLimit?: number) {
  if (!str) return [""];
  if (!limit) return [str];

  const words = str.split(" ");
  let aux = [];
  let concat = [];

  for (let i = 0; i < words.length; i++) {
    concat.push(words[i]);
    let join = concat.join(" ");
    if (join.length > limit) {
      aux.push(join);
      concat = [];
    }
  }

  if (concat.length) {
    aux.push(concat.join(" ").trim());
  }

  if (lineLimit && aux.length > lineLimit) {
    aux = aux.slice(0, lineLimit);
    aux[aux.length - 1] = aux[aux.length - 1].slice(0, -3) + "...";
  }

  return aux;
}

export function nFormatter(num: number, digits: number, locale: string) {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: locale === "ar" ? "ألف" : "K" },
    { value: 1e6, symbol: locale === "ar" ? "مليون" : "M" },
    { value: 1e9, symbol: locale === "ar" ? "مليار" : "B" },
    { value: 1e9, symbol: locale === "ar" ? "تريلون" : "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0;) {
    if (num >= si[i].value) {
      break;
    }
    i -= 1;
  }
  return `${(num / si[i].value).toFixed(digits).replace(rx, "$1")} ${si[i].symbol}`;
}
