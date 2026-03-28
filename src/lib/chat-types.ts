export type ChatCitation = {
  title: string;
  url: string;
};

export type ChatApiResponse = {
  reply: string;
  citations: ChatCitation[];
};
