import { objectType } from 'nexus';
import { SourceOfIncome } from '../../enums';
import Fisherfolk from './Fisherfolk';

const Livelihood = objectType({
  name: 'Livelihood',
  definition(t) {
    t.field('id', { type: 'BigInt' });
    t.field('fisherfolkId', { type: 'BigInt' });
    t.field('type', { type: SourceOfIncome });
    t.string('description');
    t.boolean('isMain');
    t.boolean('isArchive');
    t.field('createdAt', { type: 'DateTime' });
    t.field('updatedAt', { type: 'DateTime' });
    t.field('fisherfolk', {
      type: Fisherfolk,
      resolve: ({ id }, _, context) => {
        return context.prisma.livelihood
          .findUniqueOrThrow({ where: { id: id } })
          .fisherfolk();
      },
    });
  },
});

export default Livelihood;
