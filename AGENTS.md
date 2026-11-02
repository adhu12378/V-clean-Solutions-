<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public enquiries use a validated write-only server function and a service-role-only database function returning only the generated reference; customer records are never exposed to visitors.
- Enquiry references are allocated by a database sequence to remain unique across concurrent submissions.
- Manage customer enquiries in Lovable Cloud until a separate owner-authenticated website dashboard is explicitly confirmed.
