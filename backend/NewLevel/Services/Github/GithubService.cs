using Microsoft.Extensions.Options;
using NewLevel.Dtos.Common;
using NewLevel.Enums.GithubLabels;
using NewLevel.Interfaces.Services.Github;
using NewLevel.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Octokit;
using System.Net.Http.Headers;
using System.Text;

namespace NewLevel.Services.Github
{
    public class GithubService : IGithubService
    {
        private readonly static string _githubToken = "";
        private GitHubClient _client;

        public async Task<string> CreateIssue(CreateGitIssueInput input)
        {
            _client = new GitHubClient(new Octokit.ProductHeaderValue("newlevel"));
            _client.Credentials = new Credentials(_githubToken);

            var owner = "Caio26Gualberto";
            var repo = "newlevel";

            var newIssue = new NewIssue(input.Title)
            {
                Body = input.Description
            };

            if (input.GitLabels != null && input.GitLabels.Count > 0)
            {
                var labelsList = EnumHelper<EGitLabels>.GetDisplayValues(input.GitLabels);

                foreach (var label in labelsList)
                {
                    newIssue.Labels.Add(label);
                }
            }

            try
            {
                var createdIssue = await _client.Issue.Create(owner, repo, newIssue);
                var idResult = await AddIssueToProjectAsync("PVT_kwHOBQTWvs4AnliS", createdIssue.NodeId);
                await MoveIssueToColumnAsync("PVT_kwHOBQTWvs4AnliS", "f75ad846", idResult);
                return createdIssue.HtmlUrl;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {

            }
        }

        private async Task<string> AddIssueToProjectAsync(string projectId, string issueId)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://api.github.com/graphql");
                httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("newlevel");
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _githubToken);

                var mutation = new
                {
                    query = @"
                        mutation {
                          addProjectV2ItemById(input: {projectId: """ + projectId + @""", contentId: """ + issueId + @"""}) {
                            item {
                              id
                            }
                          }
                        }"
                };

                var response = await httpClient.PostAsync("", new StringContent(JsonConvert.SerializeObject(mutation), Encoding.UTF8, "application/json"));
                response.EnsureSuccessStatusCode();
                var responseBody = await response.Content.ReadAsStringAsync();

                return ExtractItemIdFromResponse(responseBody);
            }
        }

        private async Task MoveIssueToColumnAsync(string projectId, string columnId, string itemId)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://api.github.com/graphql");
                httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("newlevel");
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _githubToken);

                var mutation = new
                {
                    query = @"
                    mutation {
                      moveProjectV2ItemToColumn(input: {
                        projectId: """ + projectId + @"""
                        columnId: """ + columnId + @"""
                        itemId: """ + itemId + @"""
                      }) {
                        projectV2Item {
                          id
                        }
                      }
                    }"
                };

                var response = await httpClient.PostAsync("", new StringContent(JsonConvert.SerializeObject(mutation), Encoding.UTF8, "application/json"));
                response.EnsureSuccessStatusCode();
                var responseBody = await response.Content.ReadAsStringAsync();
            }
        }

        private string ExtractItemIdFromResponse(string responseBody)
        {
            dynamic response = JsonConvert.DeserializeObject(responseBody);
            return response.data.addProjectV2ItemById.item.id;
        }

    }
}