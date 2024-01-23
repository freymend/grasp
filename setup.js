import { spawn } from "child_process";
import { platform } from "process";

console.log(`Platform: ${platform}`);

const flyInstallCommand = {
    win32: 'pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"',
    linux: "curl -L https://fly.io/install.sh | sh",
    darwin: "brew install flyctl",
};

const flyInstall = spawn(flyInstallCommand[platform], { shell: true });

flyInstall.stdout.on("data", (data) => {
    console.log(`${data}`);
});

flyInstall.stderr.on("data", (data) => {
    console.error(`${data}`);
});

const extensions = ["esbenp.prettier-vscode", "dbaeumer.vscode-eslint"];

for (const extension of extensions) {
    console.log(`Installing ${extension}`);
    const installExtension = spawn("code", [
        "--force",
        "--install-extension",
        extension,
    ]);

    installExtension.stdout.on("data", (data) => {
        console.log(`${data}`);
    });

    installExtension.stderr.on("data", (data) => {
        console.error(`${data}`);
    });
}
