export function spaceAfterCapital(name) {
  return name
    .split(/(?=[A-Z])/)
    .map((word, index) => <span key={index}>{`${word.toUpperCase()} `} </span>);
}

export function reduceLink(faucetLink) {
  let link = faucetLink.replace("https://", "");
  const length = link.length;
  if (length <= 40) return link.substring(0, 40);
  else
    return (
      link.substring(0, 27) +
      "..." +
      link.substring(link.length - 10, link.length)
    );
}
