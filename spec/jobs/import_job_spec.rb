describe ImportJob do
  subject { described_class.new }

  describe '#perform' do
    before do
      allow(ImportBillsJob).to receive(:perform_async)
      allow(ImportHearingsJob).to receive(:perform_async)
    end

    it 'enqueues the bills import' do
      subject.perform
      expect(ImportBillsJob).to have_received(:perform_async)
    end

    it 'enqueues a hearings import for each chamber' do
      chamber_ids = Chamber.all.map(&:id)
      subject.perform
      expect(ImportHearingsJob).to have_received(:perform_async).with(chamber_ids[0])
      expect(ImportHearingsJob).to have_received(:perform_async).with(chamber_ids[1])
    end
  end
end
