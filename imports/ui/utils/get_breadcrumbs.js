const getBreadcrumbs = (organization, project, task) => {
  if (!organization && !project && !task) {
    return [
      {
        text: "Organizations",
      },
    ];
  }
};

export default getBreadcrumbs;
