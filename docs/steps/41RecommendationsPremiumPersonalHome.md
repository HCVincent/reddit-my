./pages/index.tsx
```ts
  return (
    <PageContent>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
              onVote={onVote}
              userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === post.id)
                  ?.voteValue
              }
              userIsCreator={user?.uid === post.creatorId}
              homePage
            />
          ))}
        </Stack>
      )}
      <Flex direction="column" boxSize="full">
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Flex>
    </PageContent>
  );
```

./components/Community/Reconmmendations.tsx
```ts
const Recommendations: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();

  const getCommunityRecommendations = async () => {
    setLoading(true);
    try {
      const communityQuery = query(
        collection(firestore, "communities"),
        orderBy("numberOfMembers", "desc"),
        limit(5)
      );
      const communityDocs = await getDocs(communityQuery);
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunities(communities as Community[]);
    } catch (error) {}
    setLoading(false);
  };
  useEffect(() => {
    getCommunityRecommendations();
  }, []);
  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/recCommsArt.png)"
        backgroundSize="cover"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
        url('images/recCommsArt.png')"
      >
        Top Communities
      </Flex>
      <Flex direction="column">
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities.map((item, index) => {
              const isJoined = !!communityStateValue.mySnippets.find(
                (snippet) => snippet.communityId === item.id
              );
              return (
                <Flex
                  key={item.id}
                  justify="space-between"
                  align="center"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  fontWeight={600}
                  fontSize="10pt"
                >
                  <Link href={`/r/${item.id}`}>
                    <Flex width="260px" align="center" p="10px 12px">
                      <Flex width="100%" align="center">
                        <Flex width="10%">
                          <Text mr={2}>{index + 1}</Text>
                        </Flex>
                        <Flex align="center" width="100%">
                          {item.imageURL ? (
                            <Image
                              alt="recommendation url"
                              borderRadius="full"
                              boxSize="28px"
                              src={item.imageURL}
                              mr={2}
                            />
                          ) : (
                            <Icon
                              as={FaReddit}
                              fontSize={30}
                              color="brand.100"
                              mr={2}
                            />
                          )}
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >{`r/${item.id}`}</span>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Link>
                  <Button
                    mr="12px"
                    height="30px"
                    fontSize="8pt"
                    onClick={(event) => {
                      event.stopPropagation();
                      onJoinOrLeaveCommunity(item, isJoined);
                    }}
                    variant={isJoined ? "outline" : "solid"}
                  >
                    {isJoined ? "Joined" : "Join"}
                  </Button>
                </Flex>
              );
            })}
            <Box p="10px 12px">
              <Button height="30px" width="100%">
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default Recommendations;
```

./components/Community/Premium.tsx
```ts
const Premium: React.FC = () => {
  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      p="12px"
      border="1px solid"
      borderColor="gray.300"
      mt={5}
    >
      <Flex mb={2}>
        <Icon as={GiCheckedShield} fontSize={26} color="brand.100" mt={2} />
        <Stack spacing={1} fontSize="9pt" pl={2}>
          <Text fontWeight={600}>Reddit Premium</Text>
          <Text>The best Reddit experience, with monthly Coins</Text>
        </Stack>
      </Flex>
      <Button height="30px" bg="brand.100">
        Try Now
      </Button>
    </Flex>
  );
};
export default Premium;
```

./components/Community/PersonalHome.tsx
```ts
const PersonalHome: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      mt={5}
    >
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="34px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/redditPersonalHome.png)"
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" mb={2}>
          <Icon as={FaReddit} fontSize={50} color="brand.100" mr={2} />
          <Text fontWeight={600}>Home</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt">
            Your personal Reddit frontpage, built for you.
          </Text>
          <Button height="30px">Create Post</Button>
          <Button variant="outline" height="30px" onClick={() => setOpen(true)}>
            Create Community
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};
export default PersonalHome;
```

./components/Navbar/Navbar.tsx
```ts
return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
      position="sticky"
      top={0}
      zIndex={999}
    >
```

./comopnents/Layout/PageContent.tsx
```ts
return (
    <Flex justify="center" p="16px 0px">
      <Flex width="95%" justify="center" maxWidth="1200px">
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        <Flex
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          flexGrow={1}
          height="0"
          position="sticky"
          top={0}
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
```