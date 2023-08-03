import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column()
  public author: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public publicationDate: Date;

  @Column('text', { array: true })
  public tags: Array<string>;
}
