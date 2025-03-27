let r=null,l=null,i=!1;function d(){return r&&l||i?Promise.resolve():(i=!0,Promise.all([fetch("https://api.github.com/users/emilanderss0n"),fetch("https://api.github.com/users/emilanderss0n/repos?sort=updated")]).then(([s,e])=>Promise.all([s.json(),e.json()])).then(([s,e])=>{r=s,l=e,i=!1}).catch(s=>{console.warn("Failed to preload GitHub data:",s),i=!1}))}async function u(s){if(s){s.innerHTML='<div class="loading-repos">Loading repositories...</div>',i&&await(async()=>{for(;i;)await new Promise(t=>setTimeout(t,100))})();try{let e=r,t=l;if(!e||!t){i=!0;const[a,c]=await Promise.all([fetch("https://api.github.com/users/emilanderss0n"),fetch("https://api.github.com/users/emilanderss0n/repos?sort=updated&per_page=6")]);e=await a.json(),t=await c.json(),r=e,l=t,i=!1}if(t.length===0){s.innerHTML="<p>No public repositories found.</p>";return}const n=`
            <div class="github-header">
                <div class="user-badge">
                    <div class="github-brand">
                        <i class="bi bi-github"></i>
                        <span>GitHub Repositories</span>
                    </div>
                    <div class="github-user">
                        <img class="avatar" src="${e.avatar_url}" alt="Profile picture" />
                        <a href="${e.html_url}" target="_blank">emilanderss0n</a>
                    </div>
                </div>
            </div>`;let o="";t.forEach(a=>{o+=`
            <a class="repo-item ${a.language==="C#"?"csharp":a.language||"Misc"}" href="${a.html_url}" target="_blank">
                <div class="repo-content">
                    <h4>${a.name}</h4>
                    <p>${a.description||"No description available"}</p>
                    <div class="repo-details">
                        <span class="tag sm"><i class="bi bi-code-slash"></i> ${a.language||"Misc"}</span>
                    </div>
                </div>
            </a>
            `}),s.innerHTML=n+o}catch(e){console.error("Error fetching GitHub repositories:",e),s.innerHTML="<p>Failed to load GitHub repositories. Please try again later.</p>"}}}export{u as loadGitHubRepositories,d as preloadGitHubData};
