resultsMain();

async function resultsMain() {
  await buildResultsList();
  displayResults(results);
}

const results = [];

async function fetchResults() {
  const resp = await fetch("data/results.json");

  const data = await resp.json();
  return data;
}

async function buildResultsList() {
  const originalObjects = await fetchResults();

  for (const orgobj of originalObjects) {
    const resultsObj = constructResult(orgobj);
    results.push(resultsObj);
  }
}

async function displayResults(results) {
  results.sort((a, b) => a.tid.localeCompare(b.tid));
  const table = document.querySelector("#results tbody");
  table.innerHTML = "";
  for (const result of results) {
    const memberName = await result.getMemberName();
    const html = /*html*/ `

      <td>${result.dato.toLocaleDateString("da")}</td>
      <td>${memberName}</td>
      <td>${result.translateDisciplin()}</td>
      <td>${result.resultType()}</td>
      <td>${result.tid}</td>
    </tr>`;

    table.insertAdjacentHTML("beforeend", html);
  }
}

// const dansk = disipliner[engelsk];

function constructResult(resultdata) {
  const ResultObject = {
    dato: new Date(resultdata.date),
    id: resultdata.id,
    disciplin: resultdata.discipline,
    type: resultdata.resultType,
    tid: resultdata.time,
    memberId: resultdata.memberId,
    fromTimeToMillis() {
      const [minutesPart, secondsPart] = this.tid.split(":");
      const [seconds, milliseconds] = secondsPart.split(".");
      const totalMilliseconds = parseInt(minutesPart, 10) * 60 * 1000 + parseInt(seconds, 10) * 1000 + parseInt(milliseconds, 10);

      return totalMilliseconds;
    },
    iScompetition() {
      return this.type === "competition";
    },
    isTraning() {
      return this.type === "training";
    },
    translateDisciplin() {
      if (this.disciplin === "backstroke") {
        return "rygsvømning";
      } else if (this.disciplin === "breaststroke") {
        return "brystsvømning";
      } else if (this.disciplin === "freestyle") {
        return "fri";
      } else if (this.disciplin === "butterfly") {
        return "butterfly";
      }
    },
    resultType() {
      if (this.iScompetition()) {
        return "stævne";
      } else if (this.isTraning()) {
        return "træning";
      }
    },
    async getMemberName() {
      const resp = await fetch("data/members.json");
      const data = await resp.json();

      for (const member of data) {
        if (member.id === this.memberId) {
          return `${member.firstName} ${member.lastName}`;
        }
      }

      return "Ukendt";
    },

    sortResults(compareOnDates) {
      return results.sort(compareOnDates);
    },
    compareOnDates(a, b) {
      if (a.tid < b.tid) {
        return -1;
      } else if (a.tid > b.tid) {
        return 1;
      }
      return 0;
    },
  };
  return ResultObject;
}

export { resultsMain };
