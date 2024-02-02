import * as fs from "fs";
import * as path from "path";
import * as process from "child_process";
import * as pkg from  "@manypkg/get-packages"
import semiver from "semiver";

// keep hold of the last version of each package, so we know if it has changed.
const old_pkgs = {}

const DIR = "../gradio_fork";

export default function tag() {
	const tag = fs.readFileSync(path.join("log.txt"), "utf-8");
	const tag_arr = tag
		.split("\n")
		.map((s) => s.trim())
		.filter((s) => s)
		// we want to start at the first commit, and end at the last commit
		.reverse();

	tag_arr.forEach((commit, i) => {
		const p = process.spawnSync("git", ["checkout", commit], {
			cwd: DIR,
		});

		// These are the current packages + version that we will tag for this commit
		const pkgs = {}

		// @manypkg/get-packages is a tool that will get all the packages in a monorepo
		pkg.getPackagesSync(DIR).packages.forEach((pkg) => {
			// could remove this, i decided not to tag old private packages.
			if (pkg.packageJson.private || pkg.packageJson.name === "gradio_test") {
				return;
			}

			if (!old_pkgs[pkg.packageJson.name] ||semiver(old_pkgs[pkg.packageJson.name], pkg.packageJson.version) === -1) {
				pkgs[pkg.packageJson.name] = pkg.packageJson.version;
				old_pkgs[pkg.packageJson.name] = pkg.packageJson.version;
			}
		});

		const formattedPkgs = Object.entries(pkgs).map(([name, version]) => {
			return `${name}@${version}`;
		});

		// console.log(commit,formattedPkgs);

		console.log("\n\n")
		
		if (p.status === 0) {
			console.log(`Checkout ${commit}: success`);

			formattedPkgs.forEach((pkg) => {
				console.log(`git tag -a ${pkg} -m ${pkg}`);
				
				// comment this out for a dry run
				process.spawnSync("git", ["tag", "-a", pkg,"-m", pkg], {
					cwd: DIR,
				});
			});

		} else {
			console.log(`Checkout ${commit}: failed`);
		}

		console.log("__________________________");
	});
}

tag();
