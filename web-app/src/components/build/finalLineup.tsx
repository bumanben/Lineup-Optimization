import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useState } from "react";
import { api } from "~/utils/api";
import ExpectedRuns from "./expectedRuns";
import { DisplayLineupPlayer } from "~/data/types";
import PlayerTable from "../playerTableView";

type PropType = {
  lineup: Record<number, DisplayLineupPlayer>;
  expectedRuns?: number;
};

const FinalLineup = ({ lineup, expectedRuns }: PropType) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [lineupName, setLineupName] = useState("");

  const saveLineup = api.lineup.saveLineup.useMutation({
    onSuccess() {
      toast.dismiss();
      toast.success("Saved lineup!");
      onOpenChange();
    },
    onError() {
      toast.dismiss();
      toast.error("Error saving lineup.");
    },
  });

  const convertDisplayLineupToRaw = (
    displayLineup: Record<number, DisplayLineupPlayer>
  ): Record<string, { name: string; data: any }> => {
    return Object.fromEntries(
      Object.entries(displayLineup).map(([spot, player]) => {
        const { playerSeason } = player;
        const { player: p, season } = playerSeason;

        return [
          spot,
          {
            name: `${p.firstName} ${p.lastName}`,
            data: season
              ? {
                plateAppearances: season.plateAppearances,
                hits: season.hits,
                runs: season.runs,
                singles: season.singles,
                doubles: season.doubles,
                triples: season.triples,
                homeruns: season.homeruns,
                walks: season.walks,
                hitByPitch: season.hitByPitch,
                intentionalWalks: season.intentionalWalks,
              }
              : null,
          },
        ];
      })
    );
  };


  const handleSave = () => {
    if (!lineup || !lineupName.trim()) {
      toast.error("Please enter a lineup name.");
      return;
    }

    toast.dismiss();
    toast.loading("Saving lineup...");

    const selectedLineupForSaving = convertDisplayLineupToRaw(lineup);

    saveLineup.mutate({
      name: lineupName,
      selectedLineup: selectedLineupForSaving,
      expectedRuns,
    });
  };

  return (
    <>
      <Card className="w-1/2 max-w-xl overflow-visible">
        <CardHeader>
          <h1 className="text-4xl font-bold text-center">Generated Lineup</h1>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-8 relative overflow-visible">
          <PlayerTable lineup={lineup} />
          {expectedRuns !== undefined && (
            <div className="absolute right-0 transform translate-x-1/2">
              <ExpectedRuns expectedRuns={expectedRuns} />
            </div>
          )}
        </CardBody>
        <CardFooter className="flex gap-4 justify-center">
          <Button onPress={() => router.reload()}>Back</Button>
          <Button onPress={onOpen} color="primary">
            Save
          </Button>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Save Lineup</ModalHeader>
              <ModalBody>
                <Input
                  label="Lineup Name"
                  placeholder="Enter a name for your lineup"
                  value={lineupName}
                  onValueChange={setLineupName}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSave}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default FinalLineup;
