export default function RenderFeatureHighlightsSection() {
  return (
    <div className="text-xs text-muted-foreground">
      <ul className="space-y-4">
        <li>
          <strong>Dark Mode/Sys Theme 🌗</strong>
          <p>Toggle between dark mode and system theme.</p>
          <button className="my-2 h-6 w-6">
            {/* <SunIcon size={14} /> */}
          </button>{" "}
          /{" "}
          <button className="my-2 h-6 w-6">
            {/* <MoonIcon size={14} /> */}
          </button>
        </li>
        <li>
          <strong>Horizontal Flip ↔️</strong>
          <p>Adjust horizontal orientation.</p>
          <button
            className="h-6 w-6 my-2"
            // onClick={() => {
            //   setMirrored((prev) => !prev);
            // }}
          >
            {/* <FlipHorizontal size={14} /> */}
          </button>
        </li>
        <hr />
        <li>
          <strong>Take Pictures 📸</strong>
          <p>Capture snapshots at any moment from the video feed.</p>
          <button
            className="h-6 w-6 my-2"
            // onClick={userPromptScreenshot}
          >
            {/* <Camera size={14} /> */}
          </button>
        </li>
        <li>
          <strong>Manual Video Recording 📽️</strong>
          <p>Manually record video clips as needed.</p>
          <button
            className="h-6 w-6 my-2"
            // onClick={userPromptRecord}
          >
            {/* <Video size={14} /> */}
          </button>
        </li>
        <hr />
        <li>
          <strong>Enable/Disable Auto Record 🚫</strong>
          <p>
            Option to enable/disable automatic video recording whenever
            required.
          </p>
          <button
            className="h-6 w-6 my-2"
            // onClick={toggleAutoRecord}
          >
            {/* {autoRecordEnabled ? (
              <Rings color="white" height={30} />
            ) : (
              <PersonStanding size={14} />
            )} */}
          </button>
        </li>

        <li>
          <strong>Volume Slider 🔊</strong>
          <p>Adjust the volume level of the notifications.</p>
        </li>
        <li>
          <strong>Camera Feed Highlighting 🎨</strong>
          <p>
            Highlights persons in <span style={{ color: "#FF0F0F" }}>red</span>{" "}
            and other objects in <span style={{ color: "#00B612" }}>green</span>
            .
          </p>
        </li>
        <hr />
        <li className="space-y-4">
          <strong>Share your thoughts 💬 </strong>
          {/* <SocialMediaLinks /> */}
          <br />
          <br />
          <br />
        </li>
      </ul>
    </div>
  );
}
