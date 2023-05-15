import { Community } from "@/atoms/communitiesAtom";
import { firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import {
  Flex,
  Stack,
  SkeletonCircle,
  Skeleton,
  Icon,
  Button,
  Text,
  Box,
  Image,
} from "@chakra-ui/react";
import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import React, { PointerEvent, useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";

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
