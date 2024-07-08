document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("select");
    const packName = document.getElementById("p-n");
    const packDesc = document.getElementById("p-d");
    const packName2 = document.getElementById("p-n2");
    const packDesc2 = document.getElementById("p-d2");
    const result = document.getElementById("r");
    const result2 = document.getElementById("r-2");
    const dependentR = document.getElementById("dependent-r");

    const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });

    const createManifest = (type, name, desc, uuid, uuidModule, dependencies = "") => `{
    "format_version": 2,
    "header": {
        "name": "${name}",
        "description": "${desc}",
        "uuid": "${uuid}",
        "version": [1, 0, 0],
        "min_engine_version": [1, 16, 0]
    },
    "modules": [
        {
            "type": "${type}",
            "uuid": "${uuidModule}",
            "version": [1, 0, 0]
        }
    ]${dependencies}
}`;

    select.addEventListener("change", () => {
        dependentR.style.display = select.value === "dependent" ? "flex" : "none";
    });

    window.generate = () => {
        const firstPackName = packName.value;
        const firstPackDesc = packDesc.value;
        const secondPackName = packName2.value;
        const secondPackDesc = packDesc2.value;

        const resourceUUID = uuid();
        const behaviorUUID = uuid();

        result.style.color = '#333';
        result2.style.color = '#333';

        const resourceDependencies = `,
    "dependencies": [
        {
            "uuid": "${behaviorUUID}",
            "version": [1, 0, 0]
        }
    ]`;

        const behaviorDependencies = `,
    "dependencies": [
        {
              "uuid": "${resourceUUID}",
              "version": [1, 0, 0]
          }
      ]`;

        if (select.value === "resource") {
            result.textContent = createManifest("resources", firstPackName, firstPackDesc, resourceUUID, uuid());
        } else if (select.value === "behavior") {
            result.textContent = createManifest("data", firstPackName, firstPackDesc, behaviorUUID, uuid());
        } else {
            result.textContent = createManifest('resources', firstPackName, firstPackDesc, resourceUUID, uuid(), resourceDependencies);
            result2.textContent = createManifest('data', secondPackName, secondPackDesc, behaviorUUID, uuid(), behaviorDependencies);
        }
    };
});

window.download = (elementId) => {
    const result = document.getElementById(elementId);
    const manifestContent = result.textContent;

    const blob = new Blob([manifestContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "manifest.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const selectText = (elementId) => {
    const element = document.getElementById(elementId);

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

window.copy = (elementId) => {
    selectText(elementId);
    document.execCommand('copy');
    alert('Result copied to clipboard!');
};