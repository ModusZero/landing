import { Octokit } from "octokit";
// TODO: Internacionalizar mensajes de error y fechas
const octokit = new Octokit({ auth: import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN });
const OWNER = "ModusZero";
const GENERAL_REPO = ".github";
const SPECIFIC_REPO = "mod0";

const general_routes: Record<string, string> = {
  'collaborate': 'CONTRIBUTING.md',
  'blog': 'blog/LATEST.md',
};

const specific_routes: Record<string, string> = {
  'docs': 'docs/README.md',
  'first-steps': 'docs/getting-started.md',
};

export async function getGitHubContent(resource: string) {
  try {
    // --- LÓGICA DE RELEASES (CHANGELOG) ---
    if (resource === 'releases') {
      const { data } = await octokit.rest.repos.listReleases({ owner: OWNER, repo: SPECIFIC_REPO });
      
      return data.map(r => {
        // Formatear botones de descarga para los binarios (exe, dmg, etc)
        const downloads = r.assets.map(asset => {
          const size = (asset.size / (1024 * 1024)).toFixed(2);
          return `[Download ${asset.name} (v${r.tag_name}) — ${size} MB](${asset.browser_download_url})`;
        }).join('\n\n');

        return `## ${r.name || r.tag_name}\n*Published on ${new Date(r.published_at!).toLocaleDateString()}*\n\n${r.body}\n\n### 📦 Distributions\n${downloads || '_No binaries attached to this release._'}`;
      }).join('\n\n---\n\n');
    }

    // --- LÓGICA DE ARCHIVOS (MARKDOWN) ---
    const isSpecific = Object.keys(specific_routes).includes(resource);

    const path = isSpecific ? specific_routes[resource] : general_routes[resource] || 'README.md';

    const { data }: any = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: isSpecific ? SPECIFIC_REPO : GENERAL_REPO,
      path: path,
    });

    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (e) {
    console.error("❌ GitHub Sync Error:", e);
    return "# Error 404\nNo se pudo sincronizar con la fuente de GitHub.";
  }
}