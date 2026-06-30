/**
 * Writes inactive-only sponsors between <!-- past-sponsors --> markers.
 * The JamesIves action's active-only:false returns everyone; this script diffs against active sponsors.
 */
import { readFileSync, writeFileSync } from "fs";

const token = process.env.PAT;
const file = process.env.SPONSORS_FILE || "README.md";
const PLACEHOLDER =
  "https://raw.githubusercontent.com/JamesIves/github-sponsors-readme-action/dev/.github/assets/placeholder.png";

if (!token) {
  console.error("PAT is required");
  process.exit(1);
}

async function fetchSponsors(activeOnly) {
  const query = `query {
    viewer {
      sponsorshipsAsMaintainer(first: 100, includePrivate: true, activeOnly: ${activeOnly}, orderBy: {field: CREATED_AT, direction: ASC}) {
        nodes {
          privacyLevel
          sponsorEntity {
            ... on User { login url name }
            ... on Organization { login url name }
          }
        }
      }
    }
  }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  return json.data.viewer.sponsorshipsAsMaintainer.nodes;
}

function sponsorKey(node) {
  if (node.privacyLevel === "PRIVATE") {
    return `private:${node.sponsorEntity?.login || "anon"}`;
  }
  return node.sponsorEntity?.login || null;
}

function toMarkup(node) {
  if (node.privacyLevel === "PRIVATE") {
    return `<img src="${PLACEHOLDER}" width="50" alt="Private sponsor" title="Private sponsor" />`;
  }

  const { login, url } = node.sponsorEntity;
  return `<a href="${url}"><img src="https://github.com/${login}.png" width="50" alt="@${login}" title="@${login}" /></a>`;
}

const active = await fetchSponsors(true);
const all = await fetchSponsors(false);
const activeKeys = new Set(active.map(sponsorKey).filter(Boolean));
const past = all.filter((node) => {
  const key = sponsorKey(node);
  return key && !activeKeys.has(key);
});

const content =
  past.length > 0
    ? past.map(toMarkup).join(" ")
    : "<sub>No past sponsors yet.</sub>";

let readme = readFileSync(file, "utf8");
const regex = /(<!-- past-sponsors -->)[\s\S]*?(<!-- past-sponsors -->)/g;

if (!regex.test(readme)) {
  console.error("past-sponsors markers not found in README");
  process.exit(1);
}

readme = readme.replace(regex, `$1\n${content}\n$2`);
writeFileSync(file, readme);
console.log(`Updated past sponsors (${past.length})`);
