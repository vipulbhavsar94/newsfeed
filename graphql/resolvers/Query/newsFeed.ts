import db, { NewsFeed, NewsFeedRow } from "../../db";

type Args = {
  fellowship: string;
  cursor: string;
};

const FEED_LIMIT = 10;

const getQueryFilters = (fellowship: string) => {
  let filters = {
    userFilter: "",
    announcementFilter: "",
    projectFilter: "",
  };
  switch (fellowship) {
    case "founders":
      filters.userFilter = "'all', 'founders', 'angels' ";
      filters.announcementFilter = "'all', 'founders'";
      filters.projectFilter = "'all', 'founders'";
      break;
    case "angels":
      filters.userFilter = "'all', 'founders', 'angels' ";
      filters.announcementFilter = "'all', 'angels'";
      filters.projectFilter = "'all', 'founders'";
      break;
    case "writers":
      filters.userFilter = "'all', 'writers'";
      filters.announcementFilter = "'all', 'writers'";
      filters.projectFilter = "'all', 'writers'";
      break;
    default:
      break;
  }
  return filters;
};

export default async function newsFeed(
  parent: unknown,
  args: Args
): Promise<NewsFeed> {
  const { fellowship, cursor } = args;
  const { userFilter, announcementFilter, projectFilter } = getQueryFilters(
    fellowship
  );
  const feed: NewsFeedRow[] | undefined = await db.getAll(
    `SELECT * FROM (
    SELECT id as uId,created_ts,name,fellowship,avatar_url,'users' as type 
    FROM users 
    WHERE fellowship IN (${userFilter})
    UNION
    SELECT id as aId,created_ts,title,fellowship, null as 'avatar_url', 'announcements' as type 
    FROM announcements 
    WHERE fellowship IN (${announcementFilter})
    UNION
    SELECT p.id as pId,p.created_ts,p.name,u.fellowship,p.icon_url,'projects' as p 
    FROM projects p 
    JOIN user_projects up ON p.id = up.project_id 
    JOIN users u ON up.user_id = u.id 
    WHERE u.fellowship IN (${projectFilter})
    )
    WHERE created_ts < $cursor
    ORDER BY created_ts DESC
    LIMIT $limit;
    `,
    [
      {
        $cursor: cursor,
        $limit: FEED_LIMIT,
      },
    ]
  );
  if (!feed) {
    throw new Error(`Unable to fetch the feed!`);
  }
  return {
    items: feed,
    cursor: feed.length < FEED_LIMIT ? null : feed[feed.length - 1]?.created_ts,
  };
}
