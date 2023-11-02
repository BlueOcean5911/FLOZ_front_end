export default function ProjectDetail(props: { pId: string }) {
  const { pId } = props;

  return (
    <div className="mt-12 flex justify-between">
      <div className="flex gap-4">
        <div>
          <input type="file" placeholder="Upload" className="w-72" />
        </div>
        <div>
          <input type="file" placeholder="Upload" className="w-72" />
        </div>
      </div>
    </div>
  );
}
